
from typing import Any, List
from pydantic import BaseModel

class CodeRequest(BaseModel):
    language: str
    code: str
    input_data: str = ""
    
    class Config:
        json_schema_extra = {
            "example": {
                "language": "python",
                "code": "print(\"Hola mundo!\")",
                "input_data": ""
            }
        }

class CompilationResult(BaseModel):
    success: bool
    output: str
    error: str = ""
    execution_time: float
    
class TestCase(BaseModel):
    input: List[Any]
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    language: str
    code: str
    function_name: str
    test_cases: list[TestCase]
    
    class Config:
        json_schema_extra = {
            "example": {
                "language": "c",
                "code": "int suma(int a, int b) { return a + b; }",
                "function_name": "suma",
                "test_cases": [
                    {"input": "2 3", "expected_output": "5", "description": "Suma básica"},
                    {"input": "0 0", "expected_output": "0", "description": "Suma con ceros"}
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
