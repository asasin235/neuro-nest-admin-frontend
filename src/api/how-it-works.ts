import api from './axios'

export const getHowItWorksContent = () => api.get('/how-it-works')

export const updateHowItWorksContent = (data: any) => api.patch('/how-it-works', data)

