from sqlmodel import Session, select
from ..models import Report

def get_reports(session: Session):
    reports = session.exec(select(Report)).all()
    return reports

def get_reports_by_problem_id(session: Session, problem_id: int):
    reports = session.exec(select(Report).where(Report.problemID == problem_id)).all()
    return reports

def create_report(session: Session, report: Report):
    report.timePosted = datetime.now()
    session.add(report)
    session.commit()
    session.refresh(report)
    return report

def delete_report(session: Session, report_id: int):
    report = session.get(Report, report_id)
    session.delete(report)
    session.commit()
    return report

def change_state_report(session: Session, report_id: int):
    report = session.get(Report, report_id)
    report.readed = not report.readed
    session.commit()
    session.refresh(report)
    return report