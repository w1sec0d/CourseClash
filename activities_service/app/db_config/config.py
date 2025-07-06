from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager
import os
import logging

logger = logging.getLogger(__name__)

# Database URLs
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/activities_db")
READ_DATABASE_URL = os.getenv("READ_DATABASE_URL", "mysql+pymysql://root:password@localhost:3309/activities_db")

# ============================================================================
# CONFIGURACIÓN DE ENGINES CON OPTIMIZACIONES
# ============================================================================

# Master Database Engine (para escrituras)
master_engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    poolclass=QueuePool,
    pool_size=20,           # Tamaño del pool base
    max_overflow=30,        # Conexiones adicionales en picos
    pool_pre_ping=True,     # Verificar conexiones antes de usar
    pool_recycle=3600,      # Reciclar conexiones cada hora
    pool_timeout=30,        # Timeout para obtener conexión
    connect_args={
        "charset": "utf8mb4",
        "connect_timeout": 10,
        "read_timeout": 30,
        "write_timeout": 30,
        "autocommit": False,
        "sql_mode": "STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
    }
)

# Read Replica Engine (para lecturas)
read_engine = create_engine(
    READ_DATABASE_URL,
    echo=False,
    poolclass=QueuePool,
    pool_size=30,           # Más conexiones para reads
    max_overflow=50,        # Más overflow para reads
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_timeout=30,
    connect_args={
        "charset": "utf8mb4",
        "connect_timeout": 10,
        "read_timeout": 30,
        "write_timeout": 30,
        "autocommit": False,
        "sql_mode": "STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO"
    }
)

# ============================================================================
# SESSION MAKERS
# ============================================================================

# Session para escrituras (Master)
MasterSessionLocal = sessionmaker(
    bind=master_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False  # Keep objects alive after commit
)

# Session para lecturas (Read Replica)
ReadSessionLocal = sessionmaker(
    bind=read_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# Import Base from the main database module to avoid conflicts
from ..database import Base

# ============================================================================
# CONTEXT MANAGERS PARA MANEJO DE SESIONES
# ============================================================================

@contextmanager
def get_master_session():
    """Context manager for write operations on master database"""
    session = MasterSessionLocal()
    try:
        logger.debug("🟢 Master session created")
        yield session
        session.commit()
        logger.debug("✅ Master session committed")
    except Exception as e:
        session.rollback()
        logger.error(f"❌ Master session rollback: {e}")
        raise
    finally:
        session.close()
        logger.debug("🔒 Master session closed")

@contextmanager
def get_read_session():
    """Context manager for read operations on read replica"""
    session = ReadSessionLocal()
    try:
        logger.debug("🔵 Read session created")
        yield session
        # No commit needed for read operations
    except Exception as e:
        logger.error(f"❌ Read session error: {e}")
        raise
    finally:
        session.close()
        logger.debug("🔒 Read session closed")

# ============================================================================
# DEPENDENCY INJECTION PARA FASTAPI
# ============================================================================

def get_db_master():
    """FastAPI dependency for master database"""
    with get_master_session() as session:
        yield session

def get_db_read():
    """FastAPI dependency for read replica database"""
    with get_read_session() as session:
        yield session

# ============================================================================
# INTELLIGENT DATABASE ROUTING
# ============================================================================

class DatabaseRouter:
    """
    Enrutador inteligente que decide automáticamente qué base de datos usar
    basado en el tipo de operación
    """
    
    @staticmethod
    def get_session_for_operation(operation_type: str = "read"):
        """
        Get appropriate session based on operation type
        
        Args:
            operation_type: 'read' or 'write'
        """
        if operation_type.lower() == "write":
            return get_master_session()
        else:
            return get_read_session()
    
    @staticmethod
    def with_fallback_to_master():
        """
        Context manager que usa read replica pero hace fallback a master si falla
        """
        @contextmanager
        def fallback_session():
            try:
                # Intentar con read replica primero
                with get_read_session() as session:
                    yield session
            except Exception as e:
                logger.warning(f"Read replica failed, falling back to master: {e}")
                # Fallback a master
                with get_master_session() as session:
                    yield session
        
        return fallback_session()

# ============================================================================
# HEALTH CHECK FUNCTIONS
# ============================================================================

def check_database_health():
    """Check health of both master and read replica databases"""
    health_status = {
        "master": False,
        "read_replica": False,
        "errors": []
    }
    
    # Check master database
    try:
        with get_master_session() as session:
            session.execute("SELECT 1")
            health_status["master"] = True
            logger.info("✅ Master database is healthy")
    except Exception as e:
        health_status["errors"].append(f"Master DB error: {str(e)}")
        logger.error(f"❌ Master database unhealthy: {e}")
    
    # Check read replica
    try:
        with get_read_session() as session:
            session.execute("SELECT 1")
            health_status["read_replica"] = True
            logger.info("✅ Read replica database is healthy")
    except Exception as e:
        health_status["errors"].append(f"Read replica DB error: {str(e)}")
        logger.error(f"❌ Read replica database unhealthy: {e}")
    
    return health_status

def get_database_stats():
    """Get database connection pool statistics"""
    stats = {
        "master_pool": {
            "pool_size": master_engine.pool.size(),
            "checked_in": master_engine.pool.checkedin(),
            "checked_out": master_engine.pool.checkedout(),
            "overflow": master_engine.pool.overflow(),
            "total_connections": master_engine.pool.size() + master_engine.pool.overflow()
        },
        "read_pool": {
            "pool_size": read_engine.pool.size(),
            "checked_in": read_engine.pool.checkedin(),
            "checked_out": read_engine.pool.checkedout(),
            "overflow": read_engine.pool.overflow(),
            "total_connections": read_engine.pool.size() + read_engine.pool.overflow()
        }
    }
    
    return stats

# ============================================================================
# INITIALIZATION
# ============================================================================

def init_database():
    """Initialize database tables"""
    try:
        # Create tables on master database
        Base.metadata.create_all(bind=master_engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise

# Global database router instance
db_router = DatabaseRouter() 