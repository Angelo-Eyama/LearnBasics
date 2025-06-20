import json
from sqlmodel import Session, select
from app.models import TestCase
from app.schemas.testCase import TestCaseCreate, TestCaseUpdate


def get_test_cases(session: Session):
    test_cases = session.exec(select(TestCase)).all()
    return test_cases


def get_test_case_by_id(session: Session, test_case_id: int):
    test_case = session.get(TestCase, test_case_id)
    return test_case


def get_test_cases_by_problem_id(session: Session, problem_id: int):
    test_cases = session.exec(
        select(TestCase).where(TestCase.problemID == problem_id)
    ).all()
    return test_cases


def create_test_case(session: Session, new_test_case: TestCaseCreate):
    
        # Convertimos a JSON con la nueva estructura
    inputs_json_value = None
    if new_test_case.inputs is not None:
        # Pydantic ya maneja la serialización correctamente
        inputs_json_value = json.dumps([input_item.model_dump() for input_item in new_test_case.inputs])
    
    
    # Convertimos del esquema Pydantic al modelo SQLModel
    test_case_db = TestCase(
        problemID=new_test_case.problemID,
        description=new_test_case.description,
        inputs_json=inputs_json_value,
        expected_output=new_test_case.expected_output
    )
    
    session.add(test_case_db)
    session.commit()
    session.refresh(test_case_db)
    # Debug
    return test_case_db


def update_test_case(*, session: Session, db_test_case: TestCase, test_case_in: TestCaseUpdate):
    # Actualizamos solo los campos que se han proporcionado
    update_data = test_case_in.model_dump(exclude_unset=True)
    
    # Manejamos 'inputs' de forma especial
    if 'inputs' in update_data:
        inputs_value = update_data.pop('inputs')
        
        if inputs_value is not None:
            
            # Convertimos los inputs a formato serializable
            serializable_inputs = []
            
            for i, input_item in enumerate(inputs_value):                
                # Si ya es un diccionario, usarlo directamente
                if isinstance(input_item, dict):
                    serializable_inputs.append(input_item)
                # Si es un objeto Pydantic, convertirlo a diccionario
                else:
                    try:
                        item_dict = input_item.model_dump()
                        serializable_inputs.append(item_dict)
                    except AttributeError as e:
                        print(f"Error al convertir item {i}: {e}")            
            # Serializar a JSON
            try:
                db_test_case.inputs_json = json.dumps(serializable_inputs)
            except Exception as e:
                raise ValueError(f"No se pudo serializar los inputs a JSON: {e}")
        else:
            db_test_case.inputs_json = None
            
    # Actualizar el resto de campos
    for field, value in update_data.items():
        setattr(db_test_case, field, value)
    
    try:
        session.add(db_test_case)
        session.commit()
        session.refresh(db_test_case)
        return db_test_case
    except Exception as e:
        session.rollback()
        print(f"Error al guardar en DB: {e}")
        raise e


def delete_test_case(session: Session, test_case_id: int):
    test_case = session.get(TestCase, test_case_id)
    session.delete(test_case)
    session.commit()
    return test_case
