import { BASE_GEOAPIFY_URL, GEOAPIFY_TOKEN } from 'astro:env/client'
import queryStringify from 'qs-stringify'
import type { Address, AutocompleteResult } from '../models/api/autocomplete'
import { Error, Ok, type Result } from '../utils/algebraic'
import { ITALY_COORDS_RECT } from './const'

const FETCH_PLACES_PARAMS = {
    filter: ITALY_COORDS_RECT,
    lang: 'it',
    format: 'json',
}

export const fetchPlaces = async (
    query: string,
): Promise<Result<Address[]>> => {
    const queryString = queryStringify({
        text: query,
        apiKey: GEOAPIFY_TOKEN,
        ...FETCH_PLACES_PARAMS,
    })

    const response = await fetch(
        `${BASE_GEOAPIFY_URL}/autocomplete?${queryString}`,
    )
    if (!response.ok) return Error('Qualcosa è andato storto')

    const result: AutocompleteResult = await response.json()

    return Ok(result.results)
}
