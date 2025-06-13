FROM python:alpine

WORKDIR /app

# Instalar dependencias básicas
RUN pip install fastapi uvicorn

# Copiar código del compilador
COPY app.py .

# Exponer puerto
EXPOSE 8001

# Comando para ejecutar
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
