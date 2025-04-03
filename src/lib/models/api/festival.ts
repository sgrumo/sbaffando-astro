import type { BlocksContent } from '@strapi/blocks-react-renderer'
import type { Address } from './geoapify'

export interface Position {
    lat: number
    lng: number
}

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

export type EnrichedFestival = Festival & {
    address?: Address
}
