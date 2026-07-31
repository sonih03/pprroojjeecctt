from pydantic import BaseModel, EmailStr


class ReportRequest(BaseModel):
    sender_email: EmailStr
    app_password: str
    receiver_email: EmailStr
    report_title: str
    keyword: str