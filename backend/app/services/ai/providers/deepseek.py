from openai import AsyncOpenAI
from app.services.ai.client import AIClient
from app.services.ai.models import CodeReviewRequest, CodeFeedbackRequest
from app.core.config import ai_settings

class OpenAICodeReviewer(AIClient):
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=ai_settings.AI_API_KEY,
            base_url=ai_settings.AI_API_BASE_URL
            )
    
    async def review_code(self, request: CodeFeedbackRequest):
        messages = [
            {"role": "system", "content": self.REVIEW_CODE_PROMPT},
            {"role": "user", "content": self._format_prompt(request, type="feedback")}
        ]
        
        response = await self.client.chat.completions.create(
            model=ai_settings.AI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    
    async def review_submission(self, request: CodeReviewRequest):
        """
        Revisa el código de una entrega de estudiante y proporciona retroalimentación.
        
        :param request: Objeto que contiene el enunciado del problema, el lenguaje y el código a revisar.
        :return: Respuesta de la IA con sugerencias y correcciones.
        """
        messages = [
            {"role": "system", "content": self.REVIEW_SUBMISSION_PROMPT},
            {"role": "user", "content": self._format_prompt(request, type="review")}
        ]
        # Llamar al modelo de IA para obtener la revisión
        response = await self.review_code(request)
        
        response = await self.client.chat.completions.create(
            model=ai_settings.AI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        return response
    
    def _format_prompt(self, request , type: str) -> str:
        # Request puede ser de tipo CodeReviewRequest o CodeFeedbackRequest
        # Prepara el prompt para la IA si es tipo "review"
        if type == "review":        
            return f"""
            Por favor, revisa este código de un estudiante:
            
            Enunciado del problema:
            {request.problem_statement}
            
            Lenguaje de programación: {request.language}
            
            Código: {request.code}
            """
        # Prepara el prompt para la IA si es tipo "feedback"
        elif type == "feedback":
            return f"""
            Por favor, analiza este código de un estudiante en busca de errores o mejoras:
            Lenguaje de programación: {request.language}
            
            Código:
            {request.code}
            {f"Salida de la terminal: {request.output}\n" if request.output else ""}
            """
        else:
            raise ValueError("Tipo de solicitud no soportado.")