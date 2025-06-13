import random
from openai import AsyncOpenAI
from app.services.ai.client import AIClient
from app.services.ai.models import CodeReviewRequest, CodeReviewResponse, Suggestion
from app.core.config import ai_settings
import re

class OpenAICodeReviewer(AIClient):
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=ai_settings.AI_API_KEY,
            base_url=ai_settings.AI_API_BASE_URL
            )
        
    async def review_code(self, request: CodeReviewRequest) -> CodeReviewResponse:
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPT},
            {"role": "user", "content": self._format_prompt(request)}
        ]
        
        response = await self.client.chat.completions.create(
            model=ai_settings.AI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        # return self._parse_response(response.choices[0].message.content)
        return response.choices[0].message.content
        
    def _format_prompt(self, request: CodeReviewRequest) -> str:
        return f"""
        Por favor, revisa este código de un estudiante:
        
        Enunciado del problema:
        {request.problem_statement}
        
        Lenguaje: {request.language}
        
        Código:
        ```{request.language}
        {request.code}
        ```
        
        Proporciona:
        1. Una explicación general
        2. Identificación de errores si los hay
        3. Sugerencias de mejora
        4. Conceptos clave para reforzar
        """
        
    def _parse_response(self, ai_response: str) -> CodeReviewResponse:
        # Parse the AI response and extract suggestions
        suggestions = []
        
        # Split response into sections and extract key information
        lines = ai_response.split('\n')
        current_suggestion = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for suggestion patterns
            if any(keyword in line.lower() for keyword in ['error', 'problema', 'incorrecto']):
                if current_suggestion:
                    suggestions.append(Suggestion(**current_suggestion))
                current_suggestion = {
                    'type': 'error',
                    'line_number': self._extract_line_number(line),
                    'message': line,
                    'suggestion': ''
                }
            elif any(keyword in line.lower() for keyword in ['mejora', 'optimizar', 'recomendación']):
                if current_suggestion:
                    suggestions.append(Suggestion(**current_suggestion))
                current_suggestion = {
                    'type': 'improvement',
                    'line_number': self._extract_line_number(line),
                    'message': line,
                    'suggestion': ''
                }
            elif current_suggestion and any(keyword in line.lower() for keyword in ['sugerencia', 'cambiar', 'usar']):
                current_suggestion['suggestion'] = line
        
        # Add the last suggestion if exists
        if current_suggestion:
            suggestions.append(Suggestion(**current_suggestion))
        
        # If no specific suggestions found, create a general one
        if not suggestions:
            suggestions.append(Suggestion(
                type='general',
                line_number=None,
                message=ai_response[:200] + '...' if len(ai_response) > 200 else ai_response,
                suggestion='Revisa los comentarios generales del código'
            ))
        
        return CodeReviewResponse(
            has_errors=len([s for s in suggestions if s.type == 'error']) > 0,
            suggestions=suggestions,
            explanation=ai_response,
            score=random.uniform(0, 1)
        )
    
    def _extract_line_number(self, text: str) -> int:
        """Extract line number from text if present"""
        match = re.search(r'línea\s*(\d+)|line\s*(\d+)', text.lower())
        if match:
            return int(match.group(1) or match.group(2))
        return None