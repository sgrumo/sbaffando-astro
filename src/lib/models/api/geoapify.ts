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

export interface Feature {
    type: string
    geometry: {
        type: string
        coordinates: [number, number]
    }
    properties: {
        country_code: string
        country: string
        datasource: {
            sourcename: string
            attribution: string
            license: string
            url: string
        }
        street: string
        state: string
        state_code: string
        county: string
        county_code: string
        city: string
        lon: number
        lat: number
        distance: number
        result_type: string
        postcode: string
        formatted: string
        address_line1: string
        address_line2: string
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
        iso3166_2: string
        rank: {
            popularity: number
        }
        place_id: string
    }
    bbox: [number, number, number, number]
}

export interface ReverseGeocodeResult {
    type: string
    features: Feature[]
    query: {
        lat: 44.13
        lon: 11.11
        plus_code: string
    }
}
