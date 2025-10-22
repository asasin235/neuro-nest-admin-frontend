import api from './axios'

export const getHomepageContent = () => api.get('/homepage-content')

export const updateHomepageContent = (data: any) => api.patch('/homepage-content', data)

