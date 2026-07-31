import os
from fastapi import APIRouter, HTTPException
from app.schemas.report import ReportRequest
from app.services.n8n_service import fetch_summary_from_n8n
from app.services.excel_service import create_excel_report
from app.services.email_service import send_email_with_excel

router = APIRouter()


@router.post("/send-report")
async def process_report(payload: ReportRequest):
    # Step 1. n8n AI 에이전트 호출
    n8n_data = await fetch_summary_from_n8n(payload.keyword)
    excel_path = create_excel_report(payload.report_title, n8n_data)

    # 🔍 터미널 디버깅 출력
    print("=" * 50)
    print("🔍 n8n 원본 응답 데이터:", n8n_data)
    print("=" * 50)

    rows = n8n_data.get("rows", [])

    # n8n 데이터 검증 (비어있으면 400 에러 감지)
    if not rows:
        raise HTTPException(
            status_code=400,
            detail="n8n에서 요약된 데이터(rows)가 비어있습니다. n8n Executions 기록을 확인해 주세요."
        )

    try:
        # Step 2. 엑셀 생성
        excel_path = create_excel_report(payload.report_title, rows)

        # Step 3. 메일 발송
        send_email_with_excel(
            sender_email=payload.sender_email,
            app_password=payload.app_password,
            receiver_email=payload.receiver_email,
            title=payload.report_title,
            file_path=excel_path
        )

        if os.path.exists(excel_path):
            os.remove(excel_path)

        return {"success": True, "message": f"'{payload.receiver_email}'(으)로 엑셀 리포트를 발송했습니다!"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))