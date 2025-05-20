import os 
from sqlalchemy  import create_engine
from sqlalchemy.orm import sessionmaker


engine = create_engine(os.environ['DATABASE_URL'], echo = True)
session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = session()
    try: 
        yield db
    finally: 
        db.close()


