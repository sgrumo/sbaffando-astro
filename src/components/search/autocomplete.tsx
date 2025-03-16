import { useEffect, useState } from 'preact/hooks'
import { match } from 'ts-pattern'
import { fetchPlaces } from '../../lib/api/autocomplete'
import type { Address } from '../../lib/models/api/autocomplete'
import { ResultType } from '../../lib/utils/algebraic'

const DEBOUNCE_TIME = 1000

export const Autocomplete = () => {
    const [locationQuery, setLocationQuery] = useState<string>()
    const [addressResults, setAddressResults] = useState<Address[]>()

    useEffect(() => {
        if (!locationQuery) return

        const getPlaces = async () => {
            const result = await fetchPlaces(locationQuery)
            match(result)
                .with({ resultType: ResultType.Ok }, res => {
                    setAddressResults(res.result)
                })
                .with({ resultType: ResultType.Error }, res => {
                    console.error('errors', res.error)
                })
                .exhaustive()
        }
        const handler = setTimeout(() => {
            getPlaces()
        }, DEBOUNCE_TIME)

        return () => {
            clearTimeout(handler)
        }
    }, [locationQuery])

    return (
        <label>
            Indirizzo
            <input
                type="text"
                onChange={e => setLocationQuery(e.currentTarget.value)}
            />
            {addressResults !== undefined &&
                addressResults.length > 0 &&
                addressResults.map(address => (
                    <div key={address.place_id}>
                        {address.address_line1},{address.address_line2},
                    </div>
                ))}
            {addressResults !== undefined &&
                addressResults.length === 0 &&
                locationQuery !== undefined &&
                locationQuery !== '' && <div>Non sono stati trovate cose</div>}
        </label>
    )
}
