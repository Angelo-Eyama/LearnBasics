from enum import Enum
from typing import Any, List
from pydantic import BaseModel

class CType(str, Enum):
    INT = "int"
    FLOAT = "float"
    CHAR_PTR = "char*"
    DOUBLE = "double"

class CArgument(BaseModel):
    value: Any
    type: CType

class TestCase(BaseModel):
    inputs: List[CArgument]
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