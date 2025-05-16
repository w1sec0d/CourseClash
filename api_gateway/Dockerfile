FROM python:3.9-slim

WORKDIR /app

# Actualiza pip
RUN pip install --upgrade pip

# Copia e instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Crear usuario antes de usarlo
RUN useradd -m appuser

# Copiar el resto del código después de crear usuario
COPY . .

# Cambiar dueño después de crear usuario y copiar código
RUN chown -R appuser:appuser /app

# Cambiar a usuario no root
USER appuser

EXPOSE 8080

# Comando para ejecutar la app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
