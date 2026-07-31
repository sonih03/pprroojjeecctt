pipeline {
    agent any

    environment {
        // 젠킨스 Credentials에 등록한 민감 정보 불러오기 (보안 정석!)
        SENDER_EMAIL = credentials('VITE_SENDER_EMAIL')
        APP_PASSWORD = credentials('VITE_APP_PASSWORD')
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo '📥 GitHub에서 최신 소스코드 수신 중...'
                // Jenkins SCM 설정 시 자동 처리됨
            }
        }

        stage('2. Generate Env Files') {
            steps {
                echo '⚙️ 프론트엔드/백엔드 환경변수(.env) 자동 작성 중...'
                sh '''
                    # 1) 프론트엔드 .env 생성
                    cat << EOF > report-automation-frontend/.env
VITE_API_BASE_URL=http://54.180.142.102:8000/api/v1
VITE_SENDER_EMAIL=${SENDER_EMAIL}
VITE_APP_PASSWORD="${APP_PASSWORD}"
EOF

                    # 2) 백엔드 .env 생성
                    cat << EOF > report-automation-backend/.env
N8N_URL=http://n8n-server:5678
N8N_WEBHOOK_URL=http://n8n-server:5678/webhook/generate-summary
EOF
                '''
            }
        }

        stage('3. Build & Deploy Containers') {
            steps {
                echo '🚀 도커 서비스 무중단/강제 재빌드 배포 시작...'
                sh '''
                    # 기존 컨테이너 캐시 없이 재빌드 및 백그라운드 실행
                    docker compose build --no-cache
                    docker compose up -d
                '''
            }
        }

        stage('4. Docker Cleanup') {
            steps {
                echo '🧹 빌드 후 남은 불필요한 도커 미사용 이미지 삭제...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '🎉 [성공] AI 자동 리포트 시스템이 무사히 자동 배포되었습니다!'
        }
        failure {
            echo '🚨 [실패] 배포 진행 중 에러가 발생했습니다. 콘솔 로그를 확인하세요!'
        }
    }
}