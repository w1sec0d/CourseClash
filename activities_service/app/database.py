from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+pymysql://root:123@localhost:3306/activities_db"
)

# Create engine with optimized pool configuration
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to True for SQL logging in development
    # Pool de conexiones optimizado para carga
    pool_size=20,  # Número base de conexiones permanentes
    max_overflow=30,  # Conexiones adicionales permitidas
    pool_timeout=60,  # Tiempo de espera por conexión (segundos)
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_pre_ping=True,  # Verificar conexiones antes de usar
    # Configuraciones adicionales para rendimiento
    connect_args={
        "charset": "utf8mb4",
        "connect_timeout": 60,
        "read_timeout": 60,
        "write_timeout": 60,
    },
)

logger.info("Database pool configuration: size=20, max_overflow=30, timeout=60s")

# Create session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        logger.error(f"Database session error: {e}")
        raise
    finally:
        db.close()


def create_tables():
    """Create all tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("All tables created successfully")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise


def drop_tables():
    """Drop all tables (use with caution)"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("All tables dropped successfully")
    except Exception as e:
        logger.error(f"Error dropping tables: {e}")
        raise
