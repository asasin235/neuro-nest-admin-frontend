import api from './axios'

export const getContactSubmissions = () => api.get('/contact-submissions')

export const getContactSubmission = (id: string) => api.get(`/contact-submissions/${id}`)

export const updateContactSubmissionStatus = (id: string, data: any) =>
  api.patch(`/contact-submissions/${id}/status`, data)

