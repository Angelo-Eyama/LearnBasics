from typing import Annotated, Any, Literal
import mysql.connector
from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field,
    model_validator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


def parse_cors(v: Any) -> list[str]:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class AISettings(BaseSettings):
    model_config = SettingsConfigDict(
        # Usamos el archivo .env situado en la raiz del proyecto
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )
    AI_API_KEY: str
    AI_API_BASE_URL: str = "https://api.deepseek.com"
    AI_MODEL: str = "deepseek-chat"
    
class CodeExecutionSettings(BaseSettings):
    COMPILATION_TIMEOUT: int = 10  # Tiempo máximo para la compilación en segundos
    EXECUTION_TIMEOUT: int = 10  # Tiempo máximo para la ejecución en segundos
    COMPILER_SERVICES = {
        "python": "http://localhost:8001",
        "c": "http://localhost:8002",
        "javascript": "http://localhost:8003"
    }

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Usamos el archivo .env situado en la raiz del proyecto
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )
    # Inicio con "api" porque podría incluir otros servicios como "web" o "admin"
    API_VERSION: str = "api/v0"
    SECRET_KEY: str
    # 60 minutes * 24 hours * 1 days = 1 day
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1
    RECOVERY_TOKEN_EXPIRE_MINUTES: int = 60 * 1
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @computed_field  # type: ignore[prop-decorator]
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]
        
    PROJECT_NAME: str = "Learn Basics Backend"
    DESCRIPTION: str = '''API para la aplicación de Learn Basics.
    Esta parte de la aplicacion representa el backend y ha sido desarrollada con FastAPI.
    En esta parte de la aplicacion se gestionan los datos recibidos desde el frontend y se realizan las operaciones necesarias para almacenarlos en la base de datos.
    Se ha utilizado **SQLModel** para la gestion de la base de datos.
    Desde la validacion de los tokens, el inicio de sesion, el registro de usuarios, la creacion de problemas, la realizacion de entregas, la gestion de comentarios y notificaciones, hasta la gestion de roles y permisos, todo se realiza en esta parte de la aplicacion.
    '''
    DATABASE_SCHEME: str # "postgresql+psycopg" or "mysql+mysqlconnector"
    DATABASE_USER : str
    DATABASE_PASSWORD : str = ""
    DATABASE_SERVER : str
    DATABASE_PORT : int = 3306
    DATABASE_NAME : str

    # Mails settings (not used in this project)
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: int = 587
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = None
    
    @model_validator(mode="after")
    def _set_default_emails_from(self) -> Self:
        if not self.EMAILS_FROM_NAME:
            self.EMAILS_FROM_NAME = self.PROJECT_NAME
        return self

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    @computed_field  # type: ignore[prop-decorator]
    @property
    def emails_enabled(self) -> bool:
        return bool(self.SMTP_HOST and self.EMAILS_FROM_EMAIL)
    
    EMAIL_TEST_USER: str = "test@example.com"
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str
    
    # Una función para crear la base de datos en caso de que no exista
    def create_database(self):
        # Conectar al servidor de MySQL
        DB_NAME = self.DATABASE_NAME
        conn = mysql.connector.connect(host=self.DATABASE_SERVER, user=self.DATABASE_USER, password=self.DATABASE_PASSWORD)
        cursor = conn.cursor()

        # Verificar si la base de datos existe
        cursor.execute(f"SHOW DATABASES LIKE '{DB_NAME}'")
        db_exists = cursor.fetchone()

        # Si no existe, crearla
        if not db_exists:
            cursor.execute(f"CREATE DATABASE {DB_NAME}")
            print(f"Base de datos '{DB_NAME}' creada exitosamente.")

        # Cerrar conexión
        cursor.close()
        conn.close()
    
# Instanciamos las clase para usarla en otros archivos
settings = Settings()
ai_settings = AISettings()
compiler_settings = CodeExecutionSettings()