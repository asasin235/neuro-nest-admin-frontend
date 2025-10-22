import api from './axios'

export const getCompanyInfo = () => api.get('/company-info')

export const updateCompanyInfo = (data: any) => api.patch('/company-info', data)

