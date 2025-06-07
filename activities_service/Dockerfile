FROM python:3.11-slim

WORKDIR /app

ENV PYTHONPATH=/app

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8003