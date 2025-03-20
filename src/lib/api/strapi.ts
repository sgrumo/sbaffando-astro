import { API_TOKEN, BASE_URL } from 'astro:env/client'
import { default as queryStringify, default as stringify } from 'qs-stringify'
import type { Festival } from '../models/api/festival'
import type { StrapiPaginatedResponse } from '../models/api/strapi'
import type { PaginationParams, SearchParams } from '../models/forms/params'
import type { Result } from '../utils/algebraic'
import { baseFetch } from './base-api'

const PAGE_SIZE = 25

export const fetchAllFestivals = async (
    params: PaginationParams,
): Promise<Festival[]> => {
    const festivals: Festival[] = []

    const pagination = stringify({
        pagination: { page: params.page, pageSize: PAGE_SIZE },
    })

    const response = await fetch(`${BASE_URL}/api/festivals?${pagination}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    })

    if (!response.ok) throw new Error('Error fetching records')
    const result: StrapiPaginatedResponse<Festival> = await response.json()

    festivals.push(...result.data)

    if (result.meta.pagination.page < result.meta.pagination.pageCount) {
        const nextPageFestivals = await fetchAllFestivals({
            page: params.page + 1,
            pageSize: PAGE_SIZE,
        })
        festivals.push(...nextPageFestivals)
    }

    return festivals
}

export const getFestivals = async ({
    values,
    pagination,
}: SearchParams): Promise<Result<StrapiPaginatedResponse<Festival>>> => {
    const filters: { [key: string]: any } = {} //TODO: tipizzare sta merda
    const paginationParams: { [key: string]: number } = {}

    if (values.position && values.radius) {
        filters['latitude'] = values.position.lat
        filters['longitude'] = values.position.lng
        filters['radius'] = values.radius
    }

    if (values.query) {
        //TODO: set case insensitive
        filters['$or'][0]['title']['$contains'] = values.query
        filters['$or'][1]['festa']['$contains'] = values.query
    }

    if (values.startDate) {
        filters['$and'][0]['startDate']['$gte'] = values.startDate
    }

    if (values.endDate) {
        filters['$and'][0]['startDate']['$gte'] = values.startDate
    }

    if (pagination) {
        paginationParams['page'] = pagination.page
        paginationParams['pageSize'] = pagination.pageSize
    }

    const query = queryStringify({ filters })

    const res = await baseFetch<StrapiPaginatedResponse<Festival>>(
        `festivals?${query}`,
    )
    return res
}
