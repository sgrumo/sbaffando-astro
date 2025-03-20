import { useEffect, useState } from 'preact/hooks'
import { match } from 'ts-pattern'
import { fetchPlaces } from '../../lib/api/autocomplete'
import type { Address } from '../../lib/models/api/autocomplete'
import { ResultType } from '../../lib/utils/algebraic'
import { Loader } from '../common/loader'

const DEBOUNCE_TIME = 500
type AutocompleteProps = {
    onResultClick: (address: Address) => void
}

export const Autocomplete = (props: AutocompleteProps) => {
    const [locationQuery, setLocationQuery] = useState<string>()
    const [selectedResult, setSelectedResult] = useState<Address>()
    const [addressResults, setAddressResults] = useState<Address[]>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!locationQuery) {
            setAddressResults(undefined)
            return
        }

        const getPlaces = async () => {
            setIsLoading(true)
            const result = await fetchPlaces(locationQuery)
            match(result)
                .with({ resultType: ResultType.Ok }, res => {
                    setAddressResults(res.result)
                })
                .with({ resultType: ResultType.Error }, res => {
                    console.error('errors', res.error)
                })
                .exhaustive()
            setIsLoading(false)
        }
        const handler = setTimeout(() => {
            getPlaces()
        }, DEBOUNCE_TIME)

        return () => {
            clearTimeout(handler)
        }
    }, [locationQuery])

    const handleResultClick = (address: Address) => {
        setSelectedResult(address)
        setAddressResults(undefined)
        props.onResultClick(address)
    }

    return (
        <label>
            Indirizzo
            <input
                type="text"
                value={
                    selectedResult
                        ? `${selectedResult.address_line1}, ${selectedResult.address_line2}`
                        : undefined
                }
                onChange={e => {
                    setSelectedResult(undefined)
                    setLocationQuery(e.currentTarget.value)
                }}
            />
            {isLoading && <Loader />}
            {!isLoading &&
                addressResults !== undefined &&
                addressResults.length > 0 &&
                addressResults.map(address => (
                    <div
                        key={address.place_id}
                        onClick={() => {
                            handleResultClick(address)
                        }}
                    >
                        {address.address_line1},{address.address_line2},
                    </div>
                ))}
            {!isLoading &&
                addressResults !== undefined &&
                addressResults.length === 0 &&
                locationQuery !== undefined &&
                locationQuery !== '' && <div>Non sono stati trovate cose</div>}
        </label>
    )
}
