from fastapi import FastAPI
from .routers import users
from .database import create_db_and_tables

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la aplicación de FastAPI"}