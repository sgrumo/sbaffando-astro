export interface Address {
    datasource: {
        sourcename: string
        attribution: string
        license: string
        url: string
    }
    country: string
    country_code: string
    state: string
    city: string
    lon: number
    lat: number
    state_code: string
    result_type: string
    formatted: string
    address_line1: string
    address_line2: string
    category: string
    timezone: {
        name: string
        offset_STD: string
        offset_STD_seconds: number
        offset_DST: string
        offset_DST_seconds: number
        abbreviation_STD: string
        abbreviation_DST: string
    }
    plus_code: string
    plus_code_short: string
    rank: {
        importance: number
        confidence: number
        confidence_city_level: number
        match_type: string
    }
    place_id: string
    bbox: {
        lon1: number
        lat1: number
        lon2: number
        lat2: number
    }
}

export interface AutocompleteResult {
    results: Address[]
}
