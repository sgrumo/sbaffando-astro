export interface Festival {
    id: string
    documentId: string
    title: string
    startDate: string
    endDate: string
    description: string | null
    createdAt: string
    updatedAt: string
    publishedAt: string
    location: Position
    slug: string
}

export interface Position {
    lat: number
    lng: number
}
