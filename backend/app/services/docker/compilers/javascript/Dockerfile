FROM node:24-slim

# Instalar Python y pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias de Python
RUN pip3 install --break-system-packages fastapi uvicorn

# Copiar código del compilador
COPY schemas.py app.py ./

# Exponer puerto
EXPOSE 8003

# Comando para ejecutar
CMD ["python3", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8003"]
