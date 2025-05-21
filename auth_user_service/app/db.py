import os 
from sqlalchemy  import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

logger.info("Initializing database connection...")
engine = create_engine(os.environ['DATABASE_URL'], echo = True)
logger.info(f"Connecting to database: {os.environ['DATABASE_URL']}")
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
logger.info("Database connection initialized successfully!")

def get_db():
    db = session()
    try: 
        yield db
    finally: 
        db.close()


