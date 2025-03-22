import type { BlocksContent } from '@strapi/blocks-react-renderer'

export interface Festival {
    id: string
    documentId: string
    title: string
    startDate: string
    endDate: string
    description: BlocksContent | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    position: Position
    slug: string
}

export interface Position {
    lat: number
    lng: number
}
