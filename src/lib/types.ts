export interface TransformedPost {
  id: string
  userId: string
  rawContent: string
  formattedContent: {
    linkedin?: string
    twitter?: string
  }
  imageUrl?: string
  status: 'draft' | 'pending' | 'published'
  createdAt: string | Date
  updatedAt: string | Date
}

export interface DbPost {
  id: string
  userId: string
  content: string
  imageUrl?: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  platforms: Array<{
    id: string
    name: string
    content: string
    published: boolean
  }>
} 