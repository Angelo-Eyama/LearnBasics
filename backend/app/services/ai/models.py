from typing import Optional
from pydantic import BaseModel

class CodeFeedbackRequest(BaseModel):
    language: str
    code: str
    output: Optional[str] = None
    
class CodeReviewRequest(CodeFeedbackRequest):
    """Modelo para la petición de revisión de código"""
    problem_statement: str