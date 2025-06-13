from typing import List, Optional
from pydantic import BaseModel

class CodeReviewRequest(BaseModel):
    """Modelo para la petición de revisión de código"""
    problem_statement: str
    language: str
    code: str
    
class Suggestion(BaseModel):
    """Modelo para una sugerencia individual"""
    type: str  # "error", "improvement", "concept"
    message: str
    line_number: Optional[int] = None
    code_snippet: Optional[str] = None

class CodeReviewResponse(BaseModel):
    """Modelo para la respuesta del análisis"""
    has_errors: Optional[bool] = None
    suggestions: List[Suggestion]
    explanation: Optional[str] = None
    score: Optional[float] = None