from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.deps import SessionDep, CurrentUser

from app.models import Report
from app.api.controllers import reports as reports_controller
from app.schemas.report import ReportCreate, ReportRead, ReportUpdate

router = APIRouter(
    tags=["Reportes"]
    )

@router.get(
    "/reports/",
    response_model=List[ReportRead],
    summary="Listado de reportes",
    description="Obtiene un listado de reportes en el sistema.",
    response_description="Listado de reportes.",
    responses={
        200: {"description": "Listado de reportes"},
        404: {"description": "No se encontraron reportes"},
    }
)
def get_reports(session: SessionDep):
    reports = reports_controller.get_reports(session)
    return reports

@router.get("/reports/problem/{problem_id}", response_model=List[ReportRead],
            summary="Listado de reportes de un problema", 
            description="Obtiene un listado de reportes de un problema en específico.", 
            response_description="Listado de reportes.",
            responses={
                200: {"description": "Listado de reportes"},
                404: {"description": "No se encontraron reportes"},
            }
            )
def get_reports_by_problem_id(problem_id: int, session: SessionDep):
    reports = reports_controller.get_reports_by_problem_id(session, problem_id)
    return reports

@router.post(
    "/reports/",
    response_model=ReportRead,
    summary="Crear un reporte",
    description="Crea un reporte en el sistema.",
    response_description="Reporte creado.",
    responses={
        200: {"description": "Reporte creado"},
        400: {"description": "Error en los datos enviados"},
    }
)
def create_report(report: ReportCreate, session: SessionDep):
    report = reports_controller.create_report(session, report)
    return report

@router.delete(
    "/reports/{report_id}", 
    response_model=ReportRead, 
    summary="Eliminar un reporte", 
    description="Elimina un reporte del sistema utilizando su ID.", 
    response_description="El reporte eliminado.",
    responses={
        200: {"description": "Reporte eliminado"},
        404: {"description": "Reporte no encontrado"},
    }
    )
def delete_report(report_id: int, session: SessionDep):
    report = reports_controller.get_report_by_id(session, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    deleted_report = reports_controller.delete_report(session, report_id)
    return deleted_report

@router.patch(
    "/reports/{report_id}",
    response_model=ReportRead,
    summary="Cambiar estado de un reporte",
    description="Cambia el estado de un reporte, de pendiente a resuelto y viceversa. Utilizando el ID para identificarlo.",
    responses={
        200: {"description": "Reporte actualizado"},
        404: {"description": "Reporte no encontrado"},
    }
    )
def change_state_report(report_id: int, session: SessionDep):
    report = reports_controller.get_report_by_id(session, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    changed_report = reports_controller.change_state_report(session, report_id)
    return changed_report