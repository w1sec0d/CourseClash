import os 
from sqlalchemy  import create_engine
from sqlalchemy.orm import sessionmaker


DATABASE_URL = "mysql+pymysql://root:123@localhost:3306/courseclash_db"
engine = create_engine(DATABASE_URL, echo = True)

session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = session()
    try: 
        yield db
    finally: 
        db.close()


