from typing import Literal, Optional, List, Any
from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

class TypedInput(BaseModel):
    """Representa un argumento tipado para una función"""
    type: Literal["int", "string", "float", "bool"]
    value: Any
    
    @field_validator('value')
    def validate_value_type(cls, v, info: ValidationInfo):
        """Valida que el valor sea del tipo especificado"""
        expected_type = info.data.get('type')
        if expected_type == "int":
            if not isinstance(v, int) or isinstance(v, bool):  # bool es subclase de int en Python
                raise ValueError("El valor debe ser un entero")
        elif expected_type == "string":
            if not isinstance(v, str):
                raise ValueError("El valor debe ser una cadena")
        elif expected_type == "float":
            if not isinstance(v, (int, float)) or isinstance(v, bool):
                raise ValueError("El valor debe ser un número decimal")
        elif expected_type == "bool":
            if not isinstance(v, bool):
                raise ValueError("El valor debe ser un booleano")
        return v

class TestCaseBase(BaseModel):
    """Esquema base para casos de prueba en la BD"""
    problemID: int
    description: Optional[str] = None
    inputs: Optional[List[TypedInput]] = None  # Lista de argumentos para la función
    expected_output: str

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseUpdate(BaseModel):
    """Esquema para actualizar casos de prueba en la BD"""
    description: Optional[str] = None
    inputs: Optional[List[TypedInput]] = None
    expected_output: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "problemID": 99,
                "description": "Caso de prueba de ejemplo",
                "inputs": [
                    {"type": "int", "value": 10},
                    {"type": "string", "value": "texto"},
                    {"type": "bool", "value": True}
                ],
                "expected_output": "Resultado esperado"
            }
        }

class TestCaseRead(TestCaseBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )

# Esquemas para API de pruebas de funciones (compiladores)
class CompilerTestCase(BaseModel):
    """Caso de prueba común para todos los compiladores"""
    inputs: Optional[List[TypedInput]] = Field(..., description="Lista de argumentos para la función")
    expected_output: str = Field(..., description="Salida esperada (serializada como string)")
    description: str = Field("", description="Descripción del caso de prueba")

class FunctionTestRequest(BaseModel):
    """Solicitud para probar una función"""
    code: str = Field(..., description="Código a evaluar")
    language: str = Field(..., description="Lenguaje de programación")
    function_name: str = Field(..., description="Nombre de la función a probar")
    test_cases: List[CompilerTestCase] = Field(..., description="Casos de prueba")
    
    class Config:
        json_schema_extra = {
            "example": {
                "language": "python",
                "code": "def format_persona(nombre, edad, ciudad):\n\treturn f'{nombre} tiene {edad} años y vive en {ciudad}'",
                "function_name": "format_persona",
                "test_cases": [
                    {
                        "inputs": [{"type": "string", "value": "Juan Carlos"}, {"type": "int", "value": 25}, {"type": "string", "value": "Buenos Aires"}],
                        "expected_output": "Juan Carlos tiene 25 años y vive en Buenos Aires",
                        "description": "Nombre compuesto"
                    },
                    {
                        "inputs": [{"type": "string", "value": "María José"}, {"type": "int", "value": 30}, {"type": "string", "value": "Ciudad de México"}],
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