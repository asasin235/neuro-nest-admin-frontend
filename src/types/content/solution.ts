export interface Solution {
  id: string
  slug: string
  title: string
  category: 'lighting' | 'security' | 'climate' | 'entertainment' | 'networking'
  heroImage?: string
  heroTitle: string
  heroSubtitle: string
  benefits: string[]
  features: string[]
  relatedProducts?: string[]
  content: string
  metaTitle?: string
  metaDescription?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateSolutionDto {
  slug: string
  title: string
  category: string
  heroImage?: string
  heroTitle: string
  heroSubtitle: string
  benefits: string[]
  features: string[]
  relatedProducts?: string[]
  content: string
  metaTitle?: string
  metaDescription?: string
  isActive?: boolean
}

export interface UpdateSolutionDto extends Partial<CreateSolutionDto> {}

