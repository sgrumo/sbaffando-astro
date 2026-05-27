import { useEffect, useState } from 'preact/hooks'
import { match } from 'ts-pattern'
import { fetchPlaces } from '../../lib/api/geoapify'
import type { Address } from '../../lib/models/api/geoapify'
import { ResultType } from '../../lib/utils/algebraic'

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
        <div className="sf-ac">
            <input
                type="text"
                id="location"
                placeholder="Es. Bologna, Cesena, casa della nonna"
                className="sf-input"
                style={{ paddingRight: '40px' }}
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
                <div className="sf-ac-spin">
                    <span className="sf-spin"></span>
                </div>
            )}

            {isOpen &&
                !isLoading &&
                addressResults !== undefined &&
                addressResults.length > 0 && (
                    <div className="sf-ac-menu">
                        {addressResults.map(address => (
                            <button
                                type="button"
                                key={address.place_id}
                                className="sf-ac-item"
                                onClick={() => handleResultClick(address)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleResultClick(address)
                                    }
                                }}
                            >
                                <span className="l1">
                                    {address.address_line1}
                                </span>
                                {address.address_line2 && (
                                    <span className="l2">
                                        {address.address_line2}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

            {isOpen &&
                !isLoading &&
                addressResults !== undefined &&
                addressResults.length === 0 && (
                    <div className="sf-ac-empty">
                        Nessuna posizione trovata
                    </div>
                )}
        </div>
    )
}
