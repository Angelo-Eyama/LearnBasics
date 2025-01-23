from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import Report
from ..controllers import reports as reports_controller
from ..schemas import ReportCreate, ReportRead

router = APIRouter(tags=["Reportes"])

@router.get("/reports/", response_model=List[ReportRead])
def get_reports(session: Session = Depends(get_session)):
    reports = reports_controller.get_reports(session)
    return reports

@router.get("/reports/problem/{problem_id}", response_model=List[ReportRead],
            summary="Listado de reportes de un problema", 
            description="Obtiene un listado de reportes de un problema en específico.", 
            response_description="Listado de reportes."
            )
def get_reports_by_problem_id(problem_id: int, session: Session = Depends(get_session)):
    reports = reports_controller.get_reports_by_problem_id(session, problem_id)
    return reports

@router.post("/reports/", response_model=ReportRead)
def create_report(report: ReportCreate, session: Session = Depends(get_session)):
    report = reports_controller.create_report(session, report)
    return report

@router.delete("/reports/{report_id}", response_model=ReportRead, summary="Eliminar un reporte", description="Elimina un reporte del sistema utilizando su ID.", response_description="El reporte eliminado.")
def delete_report(report_id: int, session: Session = Depends(get_session)):
    report = reports_controller.get_report_by_id(session, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    deleted_report = reports_controller.delete_report(session, report_id)
    return deleted_report

@router.patch("/reports/{report_id}", response_model=ReportRead)
def change_state_report(report_id: int, session: Session = Depends(get_session)):
    report = reports_controller.get_report_by_id(session, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    changed_report = reports_controller.change_state_report(session, report_id)
    return changed_report