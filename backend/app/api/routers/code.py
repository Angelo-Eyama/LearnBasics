from fastapi import APIRouter, HTTPException
import httpx
from app.services.ai.providers.deepseek import OpenAICodeReviewer
from app.services.ai.models import CodeReviewRequest, CodeFeedbackRequest
from app.core.config import compiler_settings
from app.schemas.code import CodeRequest, CompilationResult
from app.schemas.testCase import FunctionTestRequest, FunctionTestResult

router = APIRouter(
    tags=["Codigo"],
    prefix="/code"
)

request = CodeReviewRequest(
    problem_statement="Escribe un programa que imprima los números del 1 al 100, pero por cada múltiplo de 3 imprime 'Fizz', por cada múltiplo de 5 imprime 'Buzz' y por cada múltiplo de ambos imprime 'FizzBuzz'.",
    language="python",
    code="""
    def fizzbuzz():
        for i in range(1, 101):
            if i % 3 == 0 and i % 5 == 0:
                print("FizzBuzz")
            elif i % 3 == 0:
                print("Fizz")
            elif i % 5 == 0:
                print("Buzz")
            else:
                print(i)
    """
)
ai_reviewer_instance = OpenAICodeReviewer()

@router.post(
    "/feedback",
    response_model=str,
)
async def get_feedback(request: CodeFeedbackRequest):
    """
    Obtiene retroalimentación sobre el código proporcionado.
    
    Este endpoint utiliza un modelo de IA para analizar el código y proporcionar sugerencias de mejora.
    """
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="El código no puede estar vacío."
        )
    ai_review = await ai_reviewer_instance.review_code(request)
    return ai_review

@router.post(
    "/analyze",
)
async def code():
#async def code()(request: CodeReviewRequest):
    '''
        Este endpoint se utilizará para anlizar el código en las entregas de los estudiantes.
    '''
    ai_review = await ai_reviewer_instance.review_submission(request)
    return ai_review


@router.post(
    "/compile",
    response_model=CompilationResult,
)
async def compile_code( request: CodeRequest ):
    """Compila y ejecuta código en el lenguaje especificado."""
    if request.language not in compiler_settings.COMPILER_SERVICES:
        return CompilationResult(
            success=False,
            output="",
            error=f"El lenguaje {request.language} no está soportado.",
            execution_time=0.0
        )
    if not request.code.strip():
        raise HTTPException(
            status_code=400,
            detail="El código no puede estar vacío."
        )
    service_url = compiler_settings.COMPILER_SERVICES[request.language]
    try:
        async with httpx.AsyncClient(timeout=compiler_settings.COMPILATION_TIMEOUT) as client:
            response = await client.post(
                f"{service_url}/execute",
                json={
                    "code": request.code,
                    "input_data": request.input_data
                }
            )
            
            if response.status_code == 200:
                return CompilationResult(**response.json())
            else:
                return CompilationResult(
                    success=False,
                    output="",
                    error=f"Error del compilador: {response.text}",
                    execution_time=0.0
                )
                
    except httpx.TimeoutException:
        return CompilationResult(
            success=False,
            output="",
            error=f"Timeout: El código tardó demasiado en ejecutarse ({compiler_settings.COMPILATION_TIMEOUT}s)",
            execution_time=compiler_settings.COMPILATION_TIMEOUT
        )
    except httpx.ConnectError:
        return CompilationResult(
            success=False,
            output="",
            error=f"Error: No se pudo conectar al compilador de {request.language}",
            execution_time=0.0
        )
    except Exception as e:
        return CompilationResult(
            success=False,
            output="",
            error=f"Error inesperado: {str(e)}",
            execution_time=0.0
        )

@router.post("/test-function", response_model=FunctionTestResult)
async def test_function(request: FunctionTestRequest):
    """
    Prueba una función en el lenguaje especificado con casos de prueba
    """
    if not request.language:
        raise HTTPException(status_code=400, detail="Campo 'language' requerido")
    
    if request.language not in compiler_settings.COMPILER_SERVICES:
        raise HTTPException(
            status_code=400, 
            detail=f"Lenguaje no soportado. Lenguajes disponibles: {list(compiler_settings.COMPILER_SERVICES.keys())}"
        )
    
    compiler_url = compiler_settings.COMPILER_SERVICES[request.language]
    
    try:
        async with httpx.AsyncClient(timeout=compiler_settings.COMPILATION_TIMEOUT) as client:
            json_data = request.model_dump(exclude_none=True)
            response = await client.post(
                f"{compiler_url}/test-function",
                json=json_data
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Error del compilador: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail=f"Timeout: Las pruebas tardaron mas de ({compiler_settings.COMPILATION_TIMEOUT}s)"
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail=f"Error: No se pudo conectar al compilador de {request.language}"
        )