from enum import Enum
from typing import Any, List, Literal, Optional
from pydantic import BaseModel, ValidationInfo, field_validator

class CType(str, Enum):
    INT = "int"
    FLOAT = "float"
    CHAR_PTR = "char*"
    DOUBLE = "double"

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

class CArgument(BaseModel):
    value: Any
    type: CType

class TestCase(BaseModel):
    inputs: Optional[List[TypedInput]] = None
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    code: str
    function_name: str
    test_cases: list[TestCase]
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "char* concat_strings(const char* str1, const char* str2) { static char result[1024]; sprintf(result, \"%s %s\", str1, str2);return result;\n    }",
                "function_name": "concat_strings",
                "test_cases": [
                    {
                        "inputs": [ 
                            {"value": "Hola", "type": "char*"}, 
                            {"value": "Mundo", "type": "char*"}
                        ],
                        "expected_output": "Hola Mundo",
                        "description": "Concatenación simple"
                    }
                ]
            }
        }

class TestResult(BaseModel):
    test_passed: bool
    input_used: List[CArgument]
    expected_output: str
    actual_output: str
    description: str
    error: str = ""

class FunctionTestResult(BaseModel):
    success: bool
    total_tests: int
    passed_tests: int
    failed_tests: int
    test_results: list[TestResult]
    compilation_error: str = ""
    execution_time: float
    
class ExecuteRequest(BaseModel):
    code: str
    input_data: str = ""

class ExecuteResult(BaseModel):
    success: bool
    output: str
    error: str = ""
    execution_time: float