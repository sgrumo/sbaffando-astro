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
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!locationQuery) {
            setAddressResults(undefined)
            setIsOpen(false)
            return
        }

        const getPlaces = async () => {
            setIsLoading(true)
            const result = await fetchPlaces(locationQuery)
            match(result)
                .with({ resultType: ResultType.Ok }, res => {
                    setAddressResults(res.result)
                    setIsOpen(true)
                })
                .with({ resultType: ResultType.Error }, res => {
                    console.error('errors', res.error)
                    setIsOpen(false)
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
        setIsOpen(false)
        props.onResultClick(address)
    }

    const handleInputChange = (e: Event) => {
        setSelectedResult(undefined)
        setLocationQuery((e.currentTarget as HTMLInputElement).value)
    }

    return (
        <div className="relative w-full">
            <input
                type="text"
                id="location"
                placeholder="Es. Roma, Milano..."
                className="w-full rounded-lg border-2 border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none md:px-4 md:py-3 md:text-base"
                value={
                    selectedResult
                        ? `${selectedResult.address_line1}, ${selectedResult.address_line2}`
                        : locationQuery || ''
                }
                onChange={handleInputChange}
                onFocus={() => {
                    if (addressResults && addressResults.length > 0) {
                        setIsOpen(true)
                    }
                }}
                autoComplete="off"
            />

            {/* Loading Indicator */}
            {isLoading && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2 md:right-4">
                    <Loader className="h-4 w-4 md:h-5 md:w-5" />
                </div>
            )}

            {/* Results Dropdown */}
            {isOpen &&
                !isLoading &&
                addressResults !== undefined &&
                addressResults.length > 0 && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border-2 border-gray-300 bg-white shadow-lg md:max-h-64">
                        {addressResults.map(address => (
                            <button
                                type="button"
                                key={address.place_id}
                                className="w-full border-b border-gray-200 px-3 py-2.5 text-left text-sm text-gray-900 transition-colors last:border-b-0 hover:bg-yellow-100 focus:bg-yellow-100 focus:outline-none active:bg-yellow-200 md:px-4 md:py-3 md:text-base"
                                onClick={() => handleResultClick(address)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleResultClick(address)
                                    }
                                }}
                            >
                                <span className="font-medium">
                                    {address.address_line1}
                                </span>
                                {address.address_line2 && (
                                    <span className="text-xs text-gray-600 md:text-sm">
                                        {', ' + address.address_line2}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

            {/* No Results */}
            {isOpen &&
                !isLoading &&
                addressResults !== undefined &&
                addressResults.length === 0 && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border-2 border-gray-300 bg-white p-3 text-center text-sm text-gray-600 shadow-lg md:p-4 md:text-base">
                        Nessuna posizione trovata
                    </div>
                )}
        </div>
    )
}
