import api from './axios'

export const getUseCases = () => api.get('/use-cases')

export const getUseCase = (id: string) => api.get(`/use-cases/${id}`)

export const createUseCase = (data: any) => api.post('/use-cases', data)

export const updateUseCase = (id: string, data: any) => api.patch(`/use-cases/${id}`, data)

export const deleteUseCase = (id: string) => api.delete(`/use-cases/${id}`)

