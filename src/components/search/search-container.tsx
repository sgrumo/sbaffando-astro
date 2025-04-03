import { useState } from 'preact/hooks'
import type { Festival } from '../../lib/models/api/festival'
import { SearchForm } from './search-form'
import { SearchResults } from './search-results'

export const SearchContainer = () => {
    const [festivals, setFestivals] = useState<Festival[]>()

    const handleReceiveFestivals = (festivals: Festival[]) => {
        setFestivals(festivals)
    }

    const handleReset = () => {
        setFestivals(undefined)
    }

    return (
        <>
            <SearchForm
                onReset={handleReset}
                onReceiveFestivals={handleReceiveFestivals}
            />
            {festivals !== undefined && <SearchResults festivals={festivals} />}
        </>
    )
}
