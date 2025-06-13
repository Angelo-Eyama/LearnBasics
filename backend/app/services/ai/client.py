from abc import abstractmethod
from typing import Dict, Any
from app.services.base import BaseService
from app.services.ai.models import CodeReviewRequest, CodeReviewResponse
from app.core.config import settings

class AIClient(BaseService):
    """Cliente base para servicios de IA"""
    
    SYSTEM_PROMPT = """
    Eres un asistente educativo especializado en programación. Tu rol es:
    1. Analizar código de estudiantes principiantes
    2. Identificar errores y explicarlos de manera clara y didáctica
    3. Proponer mejoras que ayuden al aprendizaje
    4. Reforzar conceptos fundamentales de programación
    5. Mantener un tono positivo y motivador
    
    Debes evaluar el código considerando:
    - Corrección funcional
    - Buenas prácticas
    - Legibilidad
    - Eficiencia básica
    """

    @abstractmethod
    async def review_code(self, request: CodeReviewRequest) -> CodeReviewResponse:
        """Realiza la revisión del código"""
        pass