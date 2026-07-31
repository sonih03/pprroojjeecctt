import httpx
from fastapi import HTTPException

N8N_WEBHOOK_URL = "http://n8n-server:5678/webhook/generate-summary"

async def fetch_summary_from_n8n(keyword: str) -> dict:
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                N8N_WEBHOOK_URL,
                json={"keyword": keyword}
            )
            response.raise_for_status()
            # n8n에서 {"rows": [{"category": "...", "topic": "...", "content": "..."}, ...]} 형태로 반환
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"n8n 연동 실패: {str(e)}")