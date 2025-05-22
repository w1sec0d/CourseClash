# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# from dotenv import load_dotenv

# load_dotenv()
# import os
# DB_URL = DB_URL = os.getenv("DB_URL")
# DB_USER = DB_USER = os.getenv("DB_USER")
# DB_PASSWORD = DB_PASSWORD = os.getenv("DB_PASSWORD")
# engine = create_engine("mysql+pymysql://"+DB_USER+":"+DB_PASSWORD+"@"+DB_URL+"/dbname?charset=utf8mb4",echo=True)
# SessionLocal = sessionmaker(autocommit=False,autoflush=False, bind=engine)

# Base = declarative_base()

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()