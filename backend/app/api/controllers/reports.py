from sqlmodel import Session, select
from datetime import datetime
from app.models import Report
from app.schemas.report import ReportCreate, ReportUpdate

def get_reports_by_problem_id(*, session: Session, problem_id: int):
    reports = session.exec(
        select(Report).where(Report.problemID == problem_id)
        ).all()
    return reports

def create_report(*, session: Session, new_report: ReportCreate):
    report_db = Report.model_validate(new_report)
    session.add(report_db)
    session.commit()
    session.refresh(report_db)
    return report_db

def update_report(*, session: Session, db_report: Report, report_in: ReportUpdate):
    report_data = report_in.model_dump(exclude_unset=True)
    db_report.sqlmodel_update(report_data)
    session.add(db_report)
    session.commit()
    session.refresh(db_report)
    return db_report


def change_state_report(*, session: Session, report_id: int):
    report = session.get(Report, report_id)
    report.read = not report.read
    session.commit()
    session.refresh(report)
    return report