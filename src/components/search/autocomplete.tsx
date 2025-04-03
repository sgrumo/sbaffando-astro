import { useEffect, useState } from 'preact/hooks'
import { match } from 'ts-pattern'
import { fetchPlaces } from '../../lib/api/geoapify'
import type { Address } from '../../lib/models/api/geoapify'
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
        <div className="relative">
            <label className="flex flex-col">
                Indirizzo
                <input
                    type="text"
                    className="rounded-md border-2 border-solid border-yellow-400"
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
            </label>
            {isLoading && <Loader className="absolute top-[0%] right-0" />}
            {!isLoading &&
                addressResults !== undefined &&
                addressResults.length > 0 && (
                    <div className="absolute z-10 flex flex-col border-r-1 border-l-1 border-solid border-black bg-white">
                        {addressResults.length > 0 &&
                            addressResults.map(address => (
                                <button
                                    type="button"
                                    className="w-full cursor-pointer border-b-1 border-solid border-black py-2 pl-4 text-left hover:bg-blue-500 hover:text-white"
                                    key={address.place_id}
                                    onClick={() => {
                                        handleResultClick(address)
                                    }}
                                    onKeyDown={() => handleResultClick(address)}
                                >
                                    {address.address_line1},
                                    {address.address_line2},
                                </button>
                            ))}
                        {addressResults.length === 0 && (
                            <div>Non sono stati trovate cose</div>
                        )}
                    </div>
                )}
        </div>
    )
}
