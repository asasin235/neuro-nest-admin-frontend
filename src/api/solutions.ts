import api from './axios'

export const getSolutions = () => api.get('/solutions')

export const getSolution = (id: string) => api.get(`/solutions/${id}`)

export const createSolution = (data: any) => api.post('/solutions', data)

export const updateSolution = (id: string, data: any) => api.patch(`/solutions/${id}`, data)

export const deleteSolution = (id: string) => api.delete(`/solutions/${id}`)

