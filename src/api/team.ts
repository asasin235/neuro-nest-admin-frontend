import api from './axios'

export const getTeamMembers = () => api.get('/team')

export const getTeamMember = (id: string) => api.get(`/team/${id}`)

export const createTeamMember = (data: any) => api.post('/team', data)

export const updateTeamMember = (id: string, data: any) => api.patch(`/team/${id}`, data)

export const deleteTeamMember = (id: string) => api.delete(`/team/${id}`)

