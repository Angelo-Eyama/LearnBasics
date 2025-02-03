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
from app.schemas.user import UserPublic

router = APIRouter(
    prefix="/login",
    tags=["Login"]
    )

@router.post("/access-token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    '''
    Genera un token de acceso para el usuario.
    '''
    user = authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}