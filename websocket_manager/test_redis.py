#!/usr/bin/env python3
"""
Simple Redis test script for CourseClash
"""

import asyncio
import redis.asyncio as redis
import json
import time

REDIS_URL = "redis://:courseclash123@localhost:6379/0"


async def test_redis():
    """Test Redis connectivity and basic operations"""
    print("🔍 Testing Redis connection...")

    try:
        # Connect to Redis
        client = redis.from_url(REDIS_URL, decode_responses=True)

        # Test ping
        result = await client.ping()
        print(f"✅ Ping successful: {result}")

        # Test basic key-value operations
        test_key = "test:courseclash"
        test_value = {"message": "Hello from CourseClash!", "timestamp": time.time()}

        # Set value
        await client.setex(test_key, 60, json.dumps(test_value))
        print(f"✅ Set key '{test_key}' with TTL of 60 seconds")

        # Get value
        retrieved = await client.get(test_key)
        if retrieved:
            data = json.loads(retrieved)
            print(f"✅ Retrieved data: {data}")

        # Test user session cache
        user_id = "test_user_123"
        session_data = {
            "connected_at": time.time(),
            "connection_type": "test",
            "status": "active",
        }

        await client.setex(f"user_session:{user_id}", 3600, json.dumps(session_data))
        print(f"✅ Cached session for user {user_id}")

        # Test user presence
        await client.setex(f"user_presence:{user_id}", 300, "online")
        print(f"✅ Set user presence for {user_id}")

        # Test duel state cache
        duel_id = "test_duel_456"
        duel_state = {
            "participants": ["user1", "user2"],
            "status": "active",
            "last_activity": time.time(),
        }

        await client.setex(f"duel_state:{duel_id}", 1800, json.dumps(duel_state))
        print(f"✅ Cached duel state for {duel_id}")

        # Clean up test data
        await client.delete(
            test_key,
            f"user_session:{user_id}",
            f"user_presence:{user_id}",
            f"duel_state:{duel_id}",
        )
        print("🧹 Cleaned up test data")

        # Close connection
        await client.close()
        print("✅ Redis test completed successfully!")

    except Exception as e:
        print(f"❌ Redis test failed: {e}")
        return False

    return True


if __name__ == "__main__":
    asyncio.run(test_redis())
