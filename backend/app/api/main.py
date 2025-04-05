from fastapi import APIRouter
from app.api.routers import users, submissions, problems, roles, coments, notifications, reports
from app.api.routers import login, test_cases, code

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(submissions.router)
api_router.include_router(problems.router)
api_router.include_router(roles.router)
api_router.include_router(coments.router)
api_router.include_router(notifications.router)
api_router.include_router(reports.router)
api_router.include_router(test_cases.router)
api_router.include_router(code.router)
