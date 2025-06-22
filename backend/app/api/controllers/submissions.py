from sqlmodel import Session, select, func
from app.models import Submission, User
from fastapi import BackgroundTasks
from app.api.routers.code import test_function
from app.schemas.submission import SubmissionCreate, SubmissionUpdate, SubmissionList
from app.schemas.testCase import CompilerTestCase, FunctionTestRequest, FunctionTestResult
from app.api.controllers.problems import get_problem_by_id

async def run_tests_for_submission(submission_id: int, session: Session):
    ''' Funcion que se ejecuta en segundo plano para probar una entrega '''
    submission = get_submission_by_id(session, submission_id)
    
    
    # Convertimos los casos de prueba del problema a un formato adecuado para la prueba
    compiler_test_cases = []
    for test_case in submission.problem.testCases:
        # Los inputs ya deberían ser objetos TypedInput con campos 'type' y 'value'
        # Podemos usarlos directamente si son del formato correcto
        
        compiler_test_case = CompilerTestCase(
            description=test_case.description,
            expected_output=test_case.expected_output,
            inputs=test_case.inputs
        )
        compiler_test_cases.append(compiler_test_case)
    
    test_request = FunctionTestRequest(
        code=submission.code,
        language=submission.language,
        function_name=submission.problem.functionName,
        test_cases=compiler_test_cases
    )
    
    test_results = await test_function(test_request)
    
    # Actualizamos la entrega con los resultados
    submission.passed_tests = test_results["passed_tests"]
    submission.total_tests = test_results["total_tests"]
    submission.execution_time = test_results["execution_time"]
    submission.compilation_error = test_results["compilation_error"] if test_results["compilation_error"] else None
    submission.status = "Correcto" if test_results["passed_tests"] == test_results["total_tests"] else "Incorrecto"
    
    #Guardamos los resultados
    session.add(submission)
    session.commit()
    
    # Si es correcto, actualizamos la puntuación del usuario
    user = session.get(User, submission.userID)
    if not user:
        return
    if submission.passed_tests == submission.total_tests:
        user.score += submission.problem.score
    elif submission.passed_tests >= (submission.total_tests / 2):
        # Si al menos la mitad de las pruebas pasaron, se le da la mitad de la puntuación del problema
        user = session.get(User, submission.userID)
        user.score += round(submission.problem.score / 2, 0)
    elif submission.passed_tests > 0:
        # Si al menos una prueba pasó, se le da medio punto extra
        user = session.get(User, submission.userID)
        user.score += 1
    session.add(user)
    session.commit()

def get_submissions(session: Session):
    submissions = session.exec(select(Submission)).all()
    count = session.exec(select(func.count(Submission.id))).one()
    return SubmissionList(total=count, submissions=submissions)

def get_submission_by_id(session: Session, submission_id: int):
    submission = session.get(Submission, submission_id)
    return submission

#Funcion que devuelve todas las entregas de un problema concreto
def get_submissions_by_problem_id(session: Session, problem_id: int):
    submissions = session.exec(
        select(Submission).where(Submission.problemID == problem_id)
        ).all()
    return submissions

#Funcion que devuelve todas las entregas de un usuario concreto
def get_submissions_by_user_id(session: Session, user_id: int):
    submissions = session.exec(select(Submission).where(Submission.userID == user_id)).all()
    count = session.exec(select(func.count(Submission.id))).one()
    return SubmissionList(total=count, submissions=submissions)

def create_submission(session: Session, new_submission: SubmissionCreate, background_tasks: BackgroundTasks):
    submission_db = Submission.model_validate(new_submission)
    session.add(submission_db)
    session.commit()
    session.refresh(submission_db)
    
    # Se ejecutan las pruebas en segundo plano
    background_tasks.add_task(run_tests_for_submission, submission_db.id, session)
    
    return submission_db

def update_submission(*, session: Session, db_submission: Submission, submission_in: SubmissionUpdate):
    submission_data = submission_in.model_dump(exclude_unset=True)
    db_submission.sqlmodel_update(submission_data)
    session.add(db_submission)
    session.commit()
    session.refresh(db_submission)
    return db_submission
