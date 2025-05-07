import pytest
from fastapi import status
from fastapi.testclient import TestClient
from app.core.config import settings
from app.main import app, custom_generate_unique_id
from fastapi.routing import APIRoute

client = TestClient(app)

def test_read_root(client):
    """Prueba que la ruta raíz devuelve el mensaje de bienvenida esperado"""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Bienvenido a la aplicación de FastAPI"}


def test_app_config(client):
    """Verifica la configuración básica de la app FastAPI"""
    from app.main import app
    
    assert app.title == settings.PROJECT_NAME
    assert app.version == "0.1"
    assert app.openapi_url == f"/{settings.API_VERSION}/openapi.json"


def test_custom_generate_unique_id():
    """Prueba la función de generación de IDs personalizados para rutas"""
    # Crear una ruta de prueba con tags
    test_route = APIRoute(
        path="/test",
        endpoint=lambda: {"test": "ok"},
        methods=["GET"],
        tags=["test_tag"],
        name="test_name"
    )
    
    # Verificar que genera el ID correctamente
    assert custom_generate_unique_id(test_route) == "test_tag-test_name"
    
    # Caso sin tags
    test_route.tags = []
    assert custom_generate_unique_id(test_route) == "default-test_name"


def test_openapi_schema_standard(client):
    """Verifica que el esquema OpenAPI estándar esté disponible"""
    response = client.get(f"/{settings.API_VERSION}/openapi.json")
    assert response.status_code == status.HTTP_200_OK
    openapi_schema = response.json()
    
    # Verificar algunas propiedades básicas del esquema
    assert "openapi" in openapi_schema
    assert "info" in openapi_schema
    assert openapi_schema["info"]["title"] == settings.PROJECT_NAME
    assert openapi_schema["info"]["version"] == "0.1"


def test_openapi_schema_modified(client):
    """Verifica que la ruta personalizada /openapi.json modifica correctamente los operationId"""
    # Obtener el esquema estándar
    standard_response = client.get(f"/{settings.API_VERSION}/openapi.json")
    standard_schema = standard_response.json()
    
    # Obtener el esquema modificado
    modified_response = client.get("/openapi.json")
    assert modified_response.status_code == status.HTTP_200_OK
    modified_schema = modified_response.json()
    
    # Verificar que las rutas son las mismas pero los operationId son diferentes
    for path, path_data in standard_schema["paths"].items():
        assert path in modified_schema["paths"]
        for method, operation in path_data.items():
            if "operationId" in operation and "tags" in operation and operation["tags"]:
                standard_id = operation["operationId"]
                modified_id = modified_schema["paths"][path][method]["operationId"]
                tag = operation["tags"][0]
                
                # El ID personalizado debe ser el estándar sin el prefijo "tag-"
                prefix = f"{tag}-"
                assert standard_id.startswith(prefix)
                assert modified_id == standard_id[len(prefix):]


def test_cors_middleware_config():
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