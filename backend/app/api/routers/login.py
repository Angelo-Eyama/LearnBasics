from datetime import timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.controllers.users import authenticate, get_user_by_email, get_user_by_username
from app.api.deps import CurrentUser, SessionDep, verify_role
from app.core import security
from app.core.config import settings
from app.core.security import hash_password
from app.schemas.utils import Token
from app.schemas.user import UserPublic, UserBase

router = APIRouter(
    prefix="/login",
    tags=["Login"]
    )

@router.post("/access-token", 
            response_model=Token, 
            summary="Generar token de acceso", 
            description="Solicita datos de inicio de sesion y genera un token de acceso para el usuario.",
            )
def login_for_access_token(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    '''
    Genera un token de acceso para el usuario.
    '''
    user = authenticate(session=session,  username=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuario inactivo",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "roles": [role.name for role in user.roles]
            }, 
        expires_delta=access_token_expires
        )
    return {"access_token": access_token, "token_type": "bearer"}


''' 
    FUNCIONES A IMPLEMENTAR EN UN FUTURO:
    * Recuperar contraseña
    * Cambiar contraseña
    * Reiniciar contraseña
    * Recuperar usuario y contraseña
'''