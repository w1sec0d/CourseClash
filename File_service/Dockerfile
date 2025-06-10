# Dockerfile
FROM python:3.12-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos al contenedor
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY ./uploaded_files ./uploaded_files

# Expone el puerto donde correrá Uvicorn
EXPOSE 8000

# Comando para iniciar el servicio
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
