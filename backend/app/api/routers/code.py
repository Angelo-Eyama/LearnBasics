from fastapi import APIRouter
from app.schemas.utils import ErrorResponse, Message

router = APIRouter(
    tags=["Codigo"],
    prefix="/code"
)

@router.post(
    "/",
    responses={
        200: {"model": Message,"description": "Código creado"},
        400: {"model": ErrorResponse, "description": "Error al crear el código"},
    }
)
def code():
    return {"message": "Código creado en el servidor"}