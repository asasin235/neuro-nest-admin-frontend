import api from './axios'

export const getKnowledgeBaseArticles = () => api.get('/knowledge-base')

export const getKnowledgeBaseArticle = (id: string) => api.get(`/knowledge-base/${id}`)

export const createKnowledgeBaseArticle = (data: any) => api.post('/knowledge-base', data)

export const updateKnowledgeBaseArticle = (id: string, data: any) =>
  api.patch(`/knowledge-base/${id}`, data)

export const deleteKnowledgeBaseArticle = (id: string) => api.delete(`/knowledge-base/${id}`)

