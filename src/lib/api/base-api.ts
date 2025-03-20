import { API_TOKEN, BASE_URL } from 'astro:env/client'
import { Error, Ok, type Result } from '../utils/algebraic'

export const baseFetch = async <T>(endpoint: string): Promise<Result<T>> => {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
    })

    if (!response.ok) return Error('Error fetching records')
    const result: T = await response.json()

    return Ok(result)
}
