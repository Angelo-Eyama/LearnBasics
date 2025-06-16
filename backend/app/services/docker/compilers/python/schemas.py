from pydantic import BaseModel

class TestCase(BaseModel):
    input: str
    expected_output: str
    description: str = ""

class TestCase(BaseModel):
    input: str
    expected_output: str
    description: str = ""

class FunctionTestRequest(BaseModel):
    code: str
    function_name: str
    test_cases: list[TestCase]
    
    class Config:
        json_schema_extra = {
            "example": {
                "code": "def suma(a, b):\n\t return a + b",
                "function_name": "suma",
                "test_cases": [
                    {"input": "2 3", "expected_output": "5", "description": "Suma básica"},
                    {"input": "0 0", "expected_output": "0", "description": "Suma con ceros"}
                ]
            }
        }

class TestResult(BaseModel):
    test_passed: bool
    input_used: str
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