import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

logger.info("Initializing database connection...")

# Configuración del pool de conexiones para mejor rendimiento
engine = create_engine(
    os.environ["DATABASE_URL"],
    echo=True,
    # Pool de conexiones optimizado para carga
    pool_size=100,  # Número base de conexiones permanentes
    max_overflow=100,  # Conexiones adicionales permitidas
    pool_timeout=60,  # Tiempo de espera por conexión (segundos)
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_pre_ping=True,  # Verificar conexiones antes de usar
    # Configuraciones adicionales para rendimiento
    connect_args={"connect_timeout": 60, "read_timeout": 60, "write_timeout": 60},
)

logger.info(f"Connecting to database: {os.environ['DATABASE_URL']}")
logger.info("Pool configuration: size=20, max_overflow=30, timeout=60s")
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
logger.info("Database connection initialized successfully!")


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()
