import random
from fastapi import APIRouter
from app.schemas.utils import ErrorResponse, Message
from app.services.ai.providers.deepseek import OpenAICodeReviewer
from app.services.ai.models import CodeReviewRequest, CodeReviewResponse
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
    "/",
)
async def code():
    ai_review = await ai_reviewer_instance.review_code(request)
    return ai_review