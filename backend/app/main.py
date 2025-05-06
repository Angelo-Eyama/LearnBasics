from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.testclient import TestClient
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.utils import tags_metadata
from app.api.main import api_router
from app.schemas.utils import Message, ErrorResponse


def custom_generate_unique_id(route: APIRoute) -> str:
    '''Genera un id único para cada ruta de la API (util para el cliente frontend)'''
    tag = route.tags[0] if route.tags else "default"

    return f"{tag}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    contact={
        "name": "Learn Basics",
        "url": "https://sqlmodel.tiangolo.com",
        "email": " mymail@mail.com",
    },
    version="0.1",
    openapi_tags=tags_metadata,
    generate_unique_id_function=custom_generate_unique_id,
    openapi_url=f"/{settings.API_VERSION}/openapi.json",
)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get(
    "/",
    tags=["root"],
    response_model=Message,
    responses={404: {"model": ErrorResponse}},
)
def read_root():
    return {"message": "Bienvenido a la aplicación de FastAPI"}


@app.get(
    "/openapi.json",
    tags=["root"],
    response_model=dict,
    responses={404: {"model": ErrorResponse}},
)
def openapi():
    openapi_schema = app.openapi()

    for path_data in openapi_schema["paths"].values():
        for operation in path_data.values():
            tag = operation["tags"][0]
            operation_id = operation["operationId"]
            to_remove = f"{tag}-"
            new_operation_id = operation_id[len(to_remove):]
            operation["operationId"] = new_operation_id

    return openapi_schema


app.include_router(api_router)
