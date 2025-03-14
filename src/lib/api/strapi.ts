import { API_TOKEN, BASE_URL } from 'astro:env/client'
import stringify from 'qs-stringify'
import type { Festival } from '../models/festival'
import type { PaginationParams } from '../models/params'
import type { StrapiPaginatedResponse, StrapiResponse } from '../models/strapi'

const PAGE_SIZE = 25

export const fetchAllFestivals = async (
    params: PaginationParams = { page: 1 },
): Promise<Festival[]> => {
    const festivals: Festival[] = []
    let queryParams = ''

    if (params) {
        const pagination = stringify({
            pagination: { page: params.page, pageSize: PAGE_SIZE },
        })
        queryParams += pagination
    }

    const response = await fetch(`${BASE_URL}/api/festivals?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    })

    console.log(response.status)
    if (!response.ok) return [] // TODO: handle errors
    const result: StrapiPaginatedResponse<Festival> = await response.json()

    console.log()

    festivals.push(...result.data)

    if (result.meta.pagination.page < result.meta.pagination.pageCount) {
        const nextPageFestivals = await fetchAllFestivals({
            page: params.page + 1,
        })
        festivals.push(...nextPageFestivals)
    }

    return festivals
}

export const fetchFestivals = async (): Promise<
    StrapiPaginatedResponse<Festival>
> => {
    const response = await fetch(`${BASE_URL}/api/festivals`)
    const result = await response.json()
    return result.data
}

export const fetchFestivalById = async (
    id: string,
): Promise<StrapiResponse<Festival>> => {
    const response = await fetch(`${BASE_URL}/api/festivals/${id}`)
    const result = await response.json()
    return result.data
}
