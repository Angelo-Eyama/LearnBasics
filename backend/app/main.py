from fastapi import FastAPI
from app.core.config import settings
from app.core.utils import tags_metadata
from app.api.main import api_router


app = FastAPI(
    title= settings.PROJECT_NAME,
    description= settings.DESCRIPTION,
    contact={
        "name": "Learn Basics",
        "url": "https://sqlmodel.tiangolo.com",
        "email": " ",
    },
    version="0.1",
    openapi_tags=tags_metadata,
    openapi_url=f"/{settings.API_VERSION}/openapi.json",
)

# TODO: Configurar CORS

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la aplicación de FastAPI"}

app.include_router(api_router, prefix=f"/{settings.API_VERSION}")