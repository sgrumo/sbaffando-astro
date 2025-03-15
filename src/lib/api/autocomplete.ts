import { BASE_GEOAPIFY_URL, GEOAPIFY_TOKEN } from 'astro:env/client'
import queryStringify from 'qs-stringify'
import type { Address, AutocompleteResult } from '../models/api/autocomplete'
import { Error, Ok, type Result } from '../utils/algebraic'

export const fetchPlaces = async (
    query: string,
): Promise<Result<Address[]>> => {
    const queryString = queryStringify({
        text: query,
        apiKey: GEOAPIFY_TOKEN,
        filter: 'rect:6.6272,35.4897,18.5204,47.0921',
        lang: 'it',
        format: 'json',
    })

    const response = await fetch(
        `${BASE_GEOAPIFY_URL}/autocomplete?${queryString}`,
    )
    if (!response.ok) return Error('Qualcosa è andato storto')

    const result: AutocompleteResult = await response.json()

    return Ok(result.results)
}
