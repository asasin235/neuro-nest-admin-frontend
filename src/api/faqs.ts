import api from './axios'

export const getFAQs = () => api.get('/faqs')

export const getFAQ = (id: string) => api.get(`/faqs/${id}`)

export const createFAQ = (data: any) => api.post('/faqs', data)

export const updateFAQ = (id: string, data: any) => api.patch(`/faqs/${id}`, data)

export const deleteFAQ = (id: string) => api.delete(`/faqs/${id}`)

