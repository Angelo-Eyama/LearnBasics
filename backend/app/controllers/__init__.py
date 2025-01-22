from .users import get_users, get_user_by_id, get_user_by_username, create_user, update_user, delete_user, get_user_field
from .problems import get_problems, get_problem_by_id, create_problem, update_problem, delete_problem
from .submissions import get_submissions, get_submission_by_id, create_submission, update_submission, delete_submission, get_submissions_by_problem_id, get_submissions_by_user_id

#Definimos los métodos que estarán disponibles para ser importados desde el módulo controllers
__all__ = [
    "get_users", "get_user_by_id", "get_user_by_username", "create_user", "update_user", "delete_user", "get_user_field",
    "get_problems", "get_problem_by_id", "create_problem", "update_problem", "delete_problem",
    "get_submissions", "get_submission_by_id", "create_submission", "update_submission", "delete_submission", "get_submissions_by_problem_id", "get_submissions_by_user_id"
]