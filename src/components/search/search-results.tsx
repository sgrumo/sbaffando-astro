import type { Festival } from '../../lib/models/api/festival'
import { SearchResult } from './search-result'

type SearchResultsProps = {
    festivals: Festival[]
}

export const SearchResults = (props: SearchResultsProps) => {
    return (
        <div className="mt-4 grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-3 md:gap-x-4 md:gap-y-8 lg:grid-cols-4">
            {props.festivals.length > 0 &&
                props.festivals.map(festival =>
                    <SearchResult festival={festival} />
                )}
            {props.festivals.length === 0 && (
                <span className="mt-4 font-bold">
                    Non sono state trovate sagre con questi criteri di ricerca!
                </span>
            )}
        </div>
    )
}
