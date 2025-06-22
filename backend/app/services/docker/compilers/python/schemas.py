from typing import Any, List
from pydantic import BaseModel, Field

class TestCase(BaseModel):
    inputs: List[Any]
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    """Solicitud para probar una función"""
    code: str = Field(..., description="Código a evaluar")
    language: str = Field(..., description="Lenguaje de programación")
    function_name: str = Field(..., description="Nombre de la función a probar")
    test_cases: List[TestCase] = Field(..., description="Casos de prueba")
    
    class Config:
        json_schema_extra = {
            "example": {
                "language": "python",
                "code": "def format_persona(nombre, edad, ciudad):\n\treturn f'{nombre} tiene {edad} años y vive en {ciudad}'",
                "function_name": "format_persona",
                "test_cases": [
                    {
                        "inputs": ["Juan Carlos", 25, "Buenos Aires"],
                        "expected_output": "Juan Carlos tiene 25 años y vive en Buenos Aires",
                        "description": "Nombre compuesto"
                    },
                    {
                        "inputs": ["María José", 30, "Ciudad de México"],
                        "expected_output": "María José tiene 30 años y vive en Ciudad de México",
                        "description": "Nombre y ciudad con espacios"
                    }
                ]
            }
        }

class TestResult(BaseModel):
    """Resultado de un caso de prueba individual"""
    test_passed: bool = Field(..., description="Indica si la prueba pasó")
    input_used: List[Any] = Field(..., description="Entrada utilizada")
    expected_output: str = Field(..., description="Salida esperada")
    actual_output: str = Field(..., description="Salida obtenida")
    description: str = Field("", description="Descripción del caso de prueba")
    error: str = Field("", description="Mensaje de error si falló")

class FunctionTestResult(BaseModel):
    """Resultado completo de la prueba"""
    success: bool = Field(..., description="Indica si todas las pruebas pasaron")
    total_tests: int = Field(..., description="Número total de pruebas")
    passed_tests: int = Field(..., description="Número de pruebas exitosas")
    failed_tests: int = Field(..., description="Número de pruebas fallidas")
    test_results: List[TestResult] = Field(..., description="Resultados detallados")
    compilation_error: str = Field("", description="Error de compilación si existe")
    execution_time: float = Field(..., description="Tiempo de ejecución en ms")

class ExecuteRequest(BaseModel):
    code: str
    input_data: str = ""

class ExecuteResult(BaseModel):
    success: bool
    output: str
    error: str = ""
    execution_time: float