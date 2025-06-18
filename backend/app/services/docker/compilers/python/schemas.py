from typing import Any, List
from pydantic import BaseModel


class TestCase(BaseModel):
    input: str
    expected_output: str
    description: str = ""

class TestCase(BaseModel):
    inputs: List[Any]
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    code: str
    function_name: str
    test_cases: list[TestCase]
    
    class Config:
        json_schema_extra = {
            "example": {
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
    test_passed: bool
    input_used: List[Any]
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