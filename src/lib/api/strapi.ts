import { API_TOKEN, BASE_URL } from 'astro:env/client'
import { default as queryStringify, default as stringify } from 'qs-stringify'
import { match } from 'ts-pattern'
import type { EnrichedFestival, Festival } from '../models/api/festival'
import type { StrapiPaginatedResponse } from '../models/api/strapi'
import type { PaginationParams, SearchParams } from '../models/forms/params'
import { ResultType, type Result } from '../utils/algebraic'
import { baseFetch } from './base-api'
import { reverseGeocode } from './geoapify'

const PAGE_SIZE = 25

export const fetchAllFestivals = async (
    params: PaginationParams,
): Promise<EnrichedFestival[]> => {
    const festivals: EnrichedFestival[] = []

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

    const enrichedFestivals: EnrichedFestival[] = await Promise.all(
        result.data.map(async festival => {
            const addressResult = await reverseGeocode(
                festival.position.lat,
                festival.position.lng,
            )
            const address = match(addressResult)
                .with({ resultType: ResultType.Ok }, res => {
                    return res.result[0]
                })
                .with({ resultType: ResultType.Error }, err => {
                    console.log(err.error)
                    return undefined
                })
                .exhaustive()
            console.log(address)
            return { ...festival, address }
        }),
    )

    festivals.push(...enrichedFestivals)

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
        filters['$or'] = { 0: { title: { $contains: values.query } } }
        filters['$or'] = { 1: { slug: { $contains: values.query } } }
    }

    if (values.startDate) {
        filters['$and'] = { 0: { startDate: { $gte: values.startDate } } }
    }

    if (values.endDate) {
        filters['$and'] = { 0: { endDate: { $lte: values.endDate } } }
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
