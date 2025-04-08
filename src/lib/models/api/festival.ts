import type { Address } from './geoapify'
import type { StrapiBlock } from './strapi'

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
    description: StrapiBlock[] | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    position: Position
    slug: string
}

export type EnrichedFestival = Festival & {
    address?: Address
}
