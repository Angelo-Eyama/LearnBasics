from collections.abc import Generator
from typing import Union, Annotated, List

import jwt
from jwt.exceptions import PyJWTError, InvalidTokenError, ExpiredSignatureError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError
from sqlmodel import Session, select

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.schemas.utils import TokenPayload
from app.models import User
from app.core.utils import RoleType

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/access-token")

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
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="El token ha expirado",
        )
    except (PyJWTError, ValidationError, InvalidTokenError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No se han posido validar las credenciales",
        )

    # Estructura del token decodificado
    # sub(id), username(str), roles(list), exp(datetime)
    user = session.exec(select(User).where(User.id == token_data.sub)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if not user.active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario bloqueado")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

def verify_role(user: CurrentUser, roles: Union[str, List[str]]) -> bool:
    '''
    Verifica si el usuario tiene el rol especificado.
    '''
    if isinstance(roles, str):
        roles = [roles]
    
    # Repasamos los roles del usuario y comparamos con el rol especificado
    for user_role in user.roles:
        if user_role.name in roles:
            return True
    
    # Si no se encuentra el rol especificado, se lanza una excepcion
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="No tiene permisos para realizar esta acción",
    )

def verify_admin(user: CurrentUser) -> bool:
    '''
    Verifica si el usuario tiene el rol de administrador.
    '''
    if RoleType.ADMIN not in [user_role.name for user_role in user.roles]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tiene permisos para realizar esta acción",
        )
    else:
        return True
