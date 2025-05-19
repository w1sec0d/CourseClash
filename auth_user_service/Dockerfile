FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH=/app

ENV SECRET=Arquisoft
ENV ALGORITM=HS256

ENV MAIL_USERNAME=courseclasheducation@gmail.com
ENV MAIL_PASSWORD=omhdrobuncjwjmoh
ENV MAIL_FROM=courseclasheducation@gmail.com
ENV MAIL_PORT=587
ENV MAIL_SERVER=smtp.gmail.com

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
