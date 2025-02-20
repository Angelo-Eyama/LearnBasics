import random
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
def code(code: str):
    random_number = random.randint(1, 15)
    if code == "":
        return {"message": f"Has enviado un código vacio. Retorno aleatorio: {random_number}"}
    return {"message": f"Código Recibido.Retorno aleatorio: {random_number}"}
