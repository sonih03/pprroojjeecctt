import axiosClient from './axiosClient';

export const sendReportRequest = async (payload) => {
    const response = await axiosClient.post('/reports/send-report', payload);
    return response.data;
};