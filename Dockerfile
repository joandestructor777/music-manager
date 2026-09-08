# Usa imagen liviana de Python
FROM python:3.11-slim

# Evita que Python guarde buffers y archivos .pyc innecesarios
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Instalar dependencias
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el cdigo del backend
COPY backend/ .

# Puerto por defecto de Cloud Run es 8080
ENV PORT=8080
EXPOSE 8080

# Comando para arrancar FastAPI
CMD exec uvicorn main:app --host 0.0.0.0 --port 
