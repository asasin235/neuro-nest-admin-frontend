export * from './solution'

export interface UseCase {
  id: string
  slug: string
  title: string
  category: 'residential' | 'commercial' | 'healthcare' | 'hospitality'
  featuredImage?: string
  description: string
  challenge?: string
  solution?: string
  results?: string
  relatedPackages?: string[]
  isActive: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface KnowledgeBaseArticle {
  id: string
  slug: string
  title: string
  category: 'installation' | 'troubleshooting' | 'manuals' | 'guides'
  content: string
  featuredImage?: string
  attachments?: string[]
  videoUrl?: string
  tags?: string[]
  viewCount: number
  helpfulCount: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'technical' | 'billing' | 'shipping' | 'products'
  order: number
  isActive: boolean
  helpfulCount: number
  notHelpfulCount: number
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  profileImage?: string
  email?: string
  phone?: string
  linkedIn?: string
  twitter?: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CompanyInfo {
  id: string
  aboutUs?: string
  mission?: string
  vision?: string
  foundedYear?: number
  companySize?: string
  certifications?: string[]
  partners?: string[]
  contactEmail?: string
  contactPhone?: string
  officeAddresses?: any[]
  socialMedia?: Record<string, string>
  workingHours?: string
  updatedAt: Date
}

export interface HomepageContent {
  id: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: string
  heroVideoUrl?: string
  heroCTA1Text?: string
  heroCTA1Link?: string
  heroCTA2Text?: string
  heroCTA2Link?: string
  howItWorksSteps?: any[]
  productSeries?: any[]
  smartHomeAreas?: any[]
  ctaSectionTitle?: string
  ctaSectionText?: string
  ctaSectionButtonText?: string
  updatedAt: Date
}

export interface HowItWorksContent {
  id: string
  processSteps?: any[]
  comparisonData?: Record<string, any>
  installationTimeline?: any[]
  integrations?: any[]
  videoUrl?: string
  demoUrl?: string
  faqs?: any[]
  updatedAt: Date
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  type: 'general' | 'consultation' | 'support' | 'quote'
  status: 'new' | 'in-progress' | 'resolved'
  assignedTo?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

