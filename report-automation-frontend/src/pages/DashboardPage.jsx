import React, { useState } from 'react';
import { sendReportRequest } from '../api/reportApi';

export default function DashboardPage() {
    const [formData, setFormData] = useState({
        receiver_email: '',
        report_title: '',
        keyword: '',
    });

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage(null);
        setErrorMessage(null);

        // 1. .env 환경변수 값 가져오기
        const senderEmail = import.meta.env.VITE_SENDER_EMAIL;
        const appPassword = import.meta.env.VITE_APP_PASSWORD;

        // 2. 환경변수 미설정 시 사전 차단
        if (!senderEmail || !appPassword) {
            setErrorMessage('.env 파일에 VITE_SENDER_EMAIL 또는 VITE_APP_PASSWORD가 설정되지 않았습니다.');
            setLoading(false);
            return;
        }

        // 3. 백엔드로 보낼 Payload 생성 (필드명 백엔드 규격과 100% 일치)
        const payload = {
            sender_email: senderEmail,
            app_password: appPassword,
            receiver_email: formData.receiver_email,
            report_title: formData.report_title,
            keyword: formData.keyword,
        };

        try {
            const res = await sendReportRequest(payload);
            setStatusMessage(res?.message || '엑셀 리포트 발송 요청이 완료되었습니다!');
        } catch (err) {
            console.error(err);

            // 4. FastAPI 422 에러(배열/객체) 안전하게 문자열로 변환 (React Error #31 방지!)
            const rawDetail = err.response?.data?.detail;
            let formattedError = '리포트 생성 중 오류가 발생했습니다.';

            if (Array.isArray(rawDetail)) {
                formattedError = rawDetail
                    .map((item) => `${item.loc?.[item.loc.length - 1] || '필드'}: ${item.msg}`)
                    .join(' | ');
            } else if (typeof rawDetail === 'string') {
                formattedError = rawDetail;
            }

            setErrorMessage(formattedError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <h1 style={styles.title}>📊 AI 자동 리포트 생성기</h1>
                    <p style={styles.subtitle}>
                        키워드를 입력하면 n8n AI 에이전트가 최신 뉴스를 심층 분석하여 엑셀 리포트를 발송합니다.
                    </p>
                </header>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.section}>
                        <div style={styles.grid}>
                            <div>
                                <label style={styles.label}>받는 사람 이메일</label>
                                <input
                                    type="email"
                                    name="receiver_email"
                                    value={formData.receiver_email}
                                    onChange={handleChange}
                                    placeholder="receiver@naver.com"
                                    required
                                    style={styles.input}
                                />
                            </div>
                            <div>
                                <label style={styles.label}>리포트 제목</label>
                                <input
                                    type="text"
                                    name="report_title"
                                    value={formData.report_title}
                                    onChange={handleChange}
                                    placeholder="예: 2026 AI 에이전트 시장 분석"
                                    required
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '16px' }}>
                            <label style={styles.label}>분석 키워드</label>
                            <input
                                type="text"
                                name="keyword"
                                value={formData.keyword}
                                onChange={handleChange}
                                placeholder="예: AI 에이전트, 반도체, F1 테크놀로지"
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
                        {loading ? '🤖 n8n AI 분석 및 엑셀 리포트 발송 중...' : '🚀 엑셀 리포트 생성 및 메일 발송'}
                    </button>
                </form>

                {statusMessage && (
                    <div style={styles.successBox}>
                        🎉 {statusMessage}
                    </div>
                )}

                {errorMessage && (
                    <div style={styles.errorBox}>
                        ⚠️ {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: "'맑은 고딕', sans-serif",
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: '16px',
        padding: '36px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155',
    },
    header: { marginBottom: '28px', textAlign: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold', color: '#38BDF8', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#94A3B8', lineHeight: '1.5' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { backgroundColor: '#0F172A', padding: '20px', borderRadius: '12px', border: '1px solid #334155' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
    label: { display: 'block', fontSize: '13px', color: '#CBD5E1', marginBottom: '6px', fontWeight: '500' },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#1E293B',
        border: '1px solid #475569',
        color: '#FFF',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        padding: '14px',
        borderRadius: '8px',
        backgroundColor: '#0284C7',
        color: '#FFF',
        fontSize: '15px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
    },
    buttonDisabled: {
        padding: '14px',
        borderRadius: '8px',
        backgroundColor: '#475569',
        color: '#94A3B8',
        fontSize: '15px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'not-allowed',
    },
    successBox: {
        marginTop: '20px',
        padding: '14px',
        borderRadius: '8px',
        backgroundColor: '#064E3B',
        border: '1px solid #059669',
        color: '#34D399',
        fontSize: '14px',
        lineHeight: '1.4',
    },
    errorBox: {
        marginTop: '20px',
        padding: '14px',
        borderRadius: '8px',
        backgroundColor: '#450A0A',
        border: '1px solid #DC2626',
        color: '#F87171',
        fontSize: '14px',
        lineHeight: '1.4',
    },
};