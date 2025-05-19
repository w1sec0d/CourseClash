import os
from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv

load_dotenv()

# Configura Fast Mail con los nombres correctos
conf = ConnectionConfig(
    MAIL_USERNAME=os.environ['MAIL_USERNAME'],
    MAIL_PASSWORD=os.environ['MAIL_PASSWORD'],
    MAIL_FROM=os.environ['MAIL_FROM'],
    MAIL_PORT=int(os.environ['MAIL_PORT']),
    MAIL_SERVER=os.environ['MAIL_SERVER'],
    MAIL_STARTTLS=True,  
    MAIL_SSL_TLS=False, 
    USE_CREDENTIALS=True
)



