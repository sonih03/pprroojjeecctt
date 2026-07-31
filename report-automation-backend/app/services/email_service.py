import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

def send_email_with_excel(sender_email: str, app_password: str, receiver_email: str, title: str, file_path: str):
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"[자동 발송] {title}"

    body_text = f"안녕하세요.\n\n요청하신 [{title}] 엑셀 분석 리포트가 성공적으로 생성되어 첨부파일로 발송되었습니다.\n\n감사합니다.\n- AI Agent 자동화 시스템 -"
    msg.attach(MIMEText(body_text, 'plain'))

    # 생성된 엑셀 파일 첨부
    with open(file_path, "rb") as f:
        attach = MIMEApplication(f.read(), _subtype="xlsx")
        attach.add_header('Content-Disposition', 'attachment', filename=f"{title}_리포트.xlsx")
        msg.attach(attach)

    # Gmail SMTP 전송
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, app_password)
        server.send_message(msg)