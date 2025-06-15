"""
WebSocket Manager Service for CourseClash

This service manages WebSocket connections and acts as an intermediary
between the frontend and the duel service via RabbitMQ.
"""

import asyncio
import json
import logging
import os
import time
from typing import Dict, Set, Optional

import aio_pika
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variables
RABBITMQ_URL = os.getenv(
    "RABBITMQ_URL", "amqp://courseclash:courseclash123@cc_broker:5672/courseclash"
)
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://cc_auth_ms:8000")
DUEL_SERVICE_URL = os.getenv("DUEL_SERVICE_URL", "http://cc_duels_ms:8002")

app = FastAPI(
    title="CourseClash WebSocket Manager",
    description="WebSocket service for real-time communication in CourseClash",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WebSocketManager:
    """Manages WebSocket connections and RabbitMQ integration"""

    def __init__(self):
        self.user_connections: Dict[str, Set[WebSocket]] = {}
        self.duel_connections: Dict[str, Dict[str, WebSocket]] = (
            {}
        )  # duel_id -> {user_id: websocket}
        self.rabbitmq_connection: Optional[aio_pika.Connection] = None
        self.rabbitmq_channel: Optional[aio_pika.Channel] = None

    async def connect_rabbitmq(self):
        """Initialize RabbitMQ connection"""
        try:
            self.rabbitmq_connection = await aio_pika.connect_robust(RABBITMQ_URL)
            self.rabbitmq_channel = await self.rabbitmq_connection.channel()
            await self.rabbitmq_channel.set_qos(prefetch_count=10)

            # Setup consumers
            await self.setup_consumers()

            logger.info("RabbitMQ connection established successfully")
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise

    async def setup_consumers(self):
        """Setup RabbitMQ consumers for WebSocket events"""

        # Declare exchanges
        duels_exchange = await self.rabbitmq_channel.declare_exchange(
            "duels.topic", aio_pika.ExchangeType.TOPIC, durable=True
        )

        # WebSocket events queue (for messages to be sent to frontend)
        websocket_queue = await self.rabbitmq_channel.declare_queue(
            "websocket.events",
            durable=True,
            auto_delete=False,
            arguments={"x-message-ttl": 60000},  # 1 minute TTL
        )

        # Bind to receive duel events that should go to WebSocket
        await websocket_queue.bind(duels_exchange, "duel.websocket.*")
        await websocket_queue.consume(self.handle_websocket_message, no_ack=True)

        logger.info("RabbitMQ consumers setup completed")

    async def handle_websocket_message(
        self, message: aio_pika.abc.AbstractIncomingMessage
    ):
        """Handle messages from RabbitMQ that should be sent to WebSocket clients"""
        try:
            data = json.loads(message.body.decode())
            routing_key = message.routing_key

            logger.info(f"Received RabbitMQ message: {routing_key} -> {data}")

            if routing_key == "duel.websocket.question":
                await self.send_question_to_duel(data)
            elif routing_key == "duel.websocket.status":
                await self.send_status_to_duel(data)
            elif routing_key == "duel.websocket.results":
                await self.send_results_to_duel(data)
            elif routing_key == "duel.websocket.notification":
                await self.send_notification_to_user(data)

        except Exception as e:
            logger.error(f"Error handling websocket message: {e}")

    async def send_question_to_duel(self, data: dict):
        """Send question to duel participants"""
        duel_id = data.get("duelId")
        question_data = data.get("question")

        if duel_id in self.duel_connections:
            message = {"type": "question", "data": question_data}
            await self.broadcast_to_duel(duel_id, message)

    async def send_status_to_duel(self, data: dict):
        """Send status messages to duel participants"""
        duel_id = data.get("duelId")
        status = data.get("status")
        message_text = data.get("message", "")

        if duel_id in self.duel_connections:
            # Send text message (compatible with existing frontend)
            await self.broadcast_to_duel(duel_id, message_text, is_text=True)

    async def send_results_to_duel(self, data: dict):
        """Send duel results to participants"""
        duel_id = data.get("duelId")
        results = data.get("results")

        if duel_id in self.duel_connections:
            message = {"type": "duel_end", "data": results}
            await self.broadcast_to_duel(duel_id, message)

    async def send_notification_to_user(self, data: dict):
        """Send notification to a specific user"""
        # Handle both direct and RabbitMQ event formats
        user_id = data.get("userId") or data.get("userID")  # RabbitMQ events use userID
        notification_data = data.get("notification") or data.get("data", {}).get(
            "notification"
        )

        if user_id and user_id in self.user_connections:
            await self.send_to_user(user_id, notification_data)
            logger.info(f"Notification sent to user {user_id}")
        else:
            logger.warning(f"User {user_id} not connected for notification: {data}")

    async def connect_user_notification(self, websocket: WebSocket, user_id: str):
        """Connect user to notification channel"""
        await websocket.accept()

        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(websocket)

        # Send welcome message
        welcome_msg = {
            "type": "welcome",
            "message": "Conexión de notificaciones establecida",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        }

        await websocket.send_json(welcome_msg)
        logger.info(f"User {user_id} connected to notifications")

    async def connect_user_duel(self, websocket: WebSocket, duel_id: str, user_id: str):
        """Connect user to a duel"""
        # Validate duel access
        if not await self.validate_duel_access(duel_id, user_id):
            await websocket.close(code=4003, reason="Unauthorized access to duel")
            return False

        await websocket.accept()

        if duel_id not in self.duel_connections:
            self.duel_connections[duel_id] = {}
        self.duel_connections[duel_id][user_id] = websocket

        logger.info(f"User {user_id} connected to duel {duel_id}")

        # Notify duel service about the connection
        await self.publish_to_rabbitmq(
            "duels.topic",
            "duel.player.connected",
            {"duelId": duel_id, "userId": user_id, "timestamp": time.time()},
        )

        return True

    async def validate_duel_access(self, duel_id: str, user_id: str) -> bool:
        """Validate if user can access the duel"""
        try:
            # Check with duel service if user is authorized
            # TODO: Create duel service authorization endpoint
            # async with httpx.AsyncClient() as client:
            #     response = await client.get(
            #         f"{DUEL_SERVICE_URL}/api/duels/{duel_id}/validate/{user_id}",
            #         timeout=5.0,
            #     )
            return True
        except Exception as e:
            logger.error(f"Error validating duel access: {e}")
            # For now, allow connection if validation fails (fallback)
            # In production, you might want to be more strict
            return True

    async def disconnect_user(
        self, websocket: WebSocket, user_id: str, duel_id: str = None
    ):
        """Disconnect user from WebSocket"""
        # Remove from user connections
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

        # Remove from duel connections
        if duel_id and duel_id in self.duel_connections:
            if user_id in self.duel_connections[duel_id]:
                del self.duel_connections[duel_id][user_id]

                # Notify duel service about disconnection
                await self.publish_to_rabbitmq(
                    "duels.topic",
                    "duel.player.disconnected",
                    {"duelId": duel_id, "userId": user_id, "timestamp": time.time()},
                )

            if not self.duel_connections[duel_id]:
                del self.duel_connections[duel_id]

        logger.info(f"User {user_id} disconnected")

    async def send_to_user(self, user_id: str, data):
        """Send message to a specific user"""
        if user_id in self.user_connections:
            dead_connections = set()

            for connection in self.user_connections[user_id]:
                try:
                    if isinstance(data, str):
                        await connection.send_text(data)
                    else:
                        await connection.send_json(data)
                except Exception as e:
                    logger.warning(f"Failed to send message to user {user_id}: {e}")
                    dead_connections.add(connection)

            # Clean up dead connections
            for dead_conn in dead_connections:
                self.user_connections[user_id].discard(dead_conn)

    async def broadcast_to_duel(self, duel_id: str, data, is_text: bool = False):
        """Broadcast message to all participants in a duel"""
        if duel_id in self.duel_connections:
            dead_connections = []

            for user_id, connection in self.duel_connections[duel_id].items():
                try:
                    if is_text:
                        await connection.send_text(str(data))
                    else:
                        await connection.send_json(data)
                except Exception as e:
                    logger.warning(
                        f"Failed to send message to user {user_id} in duel {duel_id}: {e}"
                    )
                    dead_connections.append(user_id)

            # Clean up dead connections
            for user_id in dead_connections:
                if user_id in self.duel_connections[duel_id]:
                    del self.duel_connections[duel_id][user_id]

    async def handle_duel_message(self, duel_id: str, user_id: str, data: dict):
        """Handle messages from duel participants"""
        message_type = data.get("type")

        if message_type == "answer":
            # Forward answer to duel service
            await self.publish_to_rabbitmq(
                "duels.topic",
                "duel.answer.submitted",
                {
                    "duelId": duel_id,
                    "userId": user_id,
                    "questionId": data.get("questionId"),
                    "answer": data.get("answer"),
                    "timestamp": time.time(),
                },
            )
        elif message_type == "ping":
            # Respond to ping
            await self.send_to_duel_user(duel_id, user_id, {"type": "pong"})

    async def send_to_duel_user(self, duel_id: str, user_id: str, data):
        """Send message to specific user in a duel"""
        if (
            duel_id in self.duel_connections
            and user_id in self.duel_connections[duel_id]
        ):

            connection = self.duel_connections[duel_id][user_id]
            try:
                if isinstance(data, str):
                    await connection.send_text(data)
                else:
                    await connection.send_json(data)
            except Exception as e:
                logger.warning(
                    f"Failed to send message to user {user_id} in duel {duel_id}: {e}"
                )

    async def publish_to_rabbitmq(self, exchange: str, routing_key: str, data: dict):
        """Publish message to RabbitMQ"""
        try:
            if not self.rabbitmq_channel:
                logger.error("RabbitMQ channel not available")
                return

            message = aio_pika.Message(
                json.dumps(data).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            )

            exchange_obj = await self.rabbitmq_channel.get_exchange(exchange)
            await exchange_obj.publish(message, routing_key)

            logger.info(f"Published to RabbitMQ: {exchange}/{routing_key}")

        except Exception as e:
            logger.error(f"Failed to publish to RabbitMQ: {e}")


# Global WebSocket manager instance
manager = WebSocketManager()


@app.on_event("startup")
async def startup():
    """Initialize the WebSocket manager on startup"""
    await manager.connect_rabbitmq()
    logger.info("WebSocket Manager service started successfully")


@app.on_event("shutdown")
async def shutdown():
    """Cleanup on shutdown"""
    if manager.rabbitmq_connection:
        await manager.rabbitmq_connection.close()
    logger.info("WebSocket Manager service stopped")


@app.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for user notifications"""
    await manager.connect_user_notification(websocket, user_id)
    logger.info(f"User {user_id} connected to notifications")

    try:
        while True:
            data = await websocket.receive_json()

            # Handle ping-pong for keepalive
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        await manager.disconnect_user(websocket, user_id)
    except Exception as e:
        logger.error(f"Error in notifications websocket for user {user_id}: {e}")
        await manager.disconnect_user(websocket, user_id)


@app.websocket("/ws/duels/{duel_id}/{user_id}")
async def websocket_duel(websocket: WebSocket, duel_id: str, user_id: str):
    """WebSocket endpoint for duel participation"""
    if not await manager.connect_user_duel(websocket, duel_id, user_id):
        return

    try:
        while True:
            data = await websocket.receive_json()
            await manager.handle_duel_message(duel_id, user_id, data)

    except WebSocketDisconnect:
        await manager.disconnect_user(websocket, user_id, duel_id)
    except Exception as e:
        logger.error(
            f"Error in duel websocket for user {user_id} in duel {duel_id}: {e}"
        )
        await manager.disconnect_user(websocket, user_id, duel_id)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "CourseClash WebSocket Manager is running"}


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "user_connections": len(manager.user_connections),
        "duel_connections": len(manager.duel_connections),
        "rabbitmq_connected": manager.rabbitmq_connection is not None
        and not manager.rabbitmq_connection.is_closed,
    }
