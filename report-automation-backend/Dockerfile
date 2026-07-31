FROM python:3.12-slim

WORKDIR /app

# 패키지 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 전체 백엔드 소스코드 복사
COPY . .

# 엑셀 보고서 저장용 폴더 생성
RUN mkdir -p /app/data

EXPOSE 8000

# app/main.py 안의 FastAPI 객체(app) 구동
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]