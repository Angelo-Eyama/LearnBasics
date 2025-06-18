from typing import Any, List
from pydantic import BaseModel

class TestCase(BaseModel):
    inputs: List[Any]
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    code: str
    function_name: str
    test_cases: List[TestCase]
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "function suma(a, b) { return a + b; }",
                "function_name": "suma",
                "test_cases": [
                    { "description": "Suma básica", "expected_output": "5", "inputs": [2,3] },
                    { "description": "Suma 2", "expected_output": "10", "inputs": [7,3] }
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