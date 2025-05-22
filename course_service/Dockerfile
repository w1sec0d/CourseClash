FROM python:3.10-slim

WORKDIR /app

ENV PYTHONPATH=/app

RUN pip install --upgrade pip

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 8001

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
