from fastapi import status
from fastapi.testclient import TestClient
from app.core.config import settings
from app.main import app

client = TestClient(app)

def test_read_root():
    """Prueba que la ruta raíz devuelve el mensaje correcto"""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Bienvenido a la aplicación de FastAPI"}

def test_openapi_schema_modified():
    """Verifica que el openapi.json tenga los operationId modificados"""
    response = client.get("/openapi.json")
    assert response.status_code == status.HTTP_200_OK
    openapi_schema = response.json()
    
    # Verifica que se hayan removido los prefijos de tags en operationId
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            if "operationId" in operation and "tags" in operation and operation["tags"]:
                # Asegura que el operationId no comienza con "tag-"
                tag = operation["tags"][0]
                assert not operation["operationId"].startswith(f"{tag}-")

def test_cors_middleware():
    """Prueba que los CORS estén configurados correctamente (si hay origenes)"""
    from app.core.config import settings
    
    if settings.all_cors_origins:
        # Simula una petición de origen diferente
        origin = settings.all_cors_origins[0]
        response = client.options(
            "/",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "GET"
            }
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access-control-allow-origin" in response.headers
        assert origin in response.headers["access-control-allow-origin"]

def test_app_config():
    """Verifica la configuración básica de la app FastAPI"""
    assert app.title == settings.PROJECT_NAME
    assert app.version == "0.1"
    assert app.openapi_url == f"/{settings.API_VERSION}/openapi.json"