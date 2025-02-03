from collections.abc import Generator
from typing import Annotaded

import jwt
from jwt.exceptions import PyJWTError, InvalidTokenError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlmodel import Session

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.schemas.utils import TokenPayload
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_VERSION}/login/access-token")

def get_db() -> Generator:
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]

def get_current_user(session: SessionDep, token: TokenDep) -> User:
    '''
    Valida el token de acceso y devuelve la instancia del usuario asociado al token.
    '''
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
        # La llamada TokenPayload(**payload) pasa como parametros cada par clave-valor del diccionario payload
        token_data = TokenPayload(**payload)
    except (PyJWTError, ValidationError, InvalidTokenError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No se ha posido validar las credenciales",
        )
    
    user = session.exec(select(User).where(User.id == token_data.sub)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if not user.active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario bloqueado")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

def verify_role(user: CurrentUser, role: str) -> None:
    '''
    Verifica si el usuario tiene el rol especificado.
    '''
    if role not in user.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="No tiene permisos suficientes para ejecutar esta accion"
        )
    return user