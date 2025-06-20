
from pydantic import BaseModel

# Esquema para la ejecucion
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
