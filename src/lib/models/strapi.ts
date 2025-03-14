export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}

export interface StrapiResponse<T> {
    data: T,
    meta: {}
}

export interface StrapiPaginatedResponse<T> {
    data: Array<T>,
    meta: {
        pagination: Pagination
    }
}