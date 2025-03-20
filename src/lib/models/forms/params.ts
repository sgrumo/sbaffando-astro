import type { SearchFormData } from './schemas'

export interface PaginationParams {
    page: number
    pageSize: number
}

export interface SearchParams {
    pagination?: PaginationParams
    values: SearchFormData
}
