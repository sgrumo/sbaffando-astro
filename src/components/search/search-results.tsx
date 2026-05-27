import type { Festival } from '../../lib/models/api/festival'
import { SearchResult } from './search-result'

type SearchResultsProps = {
    festivals: Festival[]
}

export const SearchResults = (props: SearchResultsProps) => {
    const count = props.festivals.length
    return (
        <section className="rs-section">
            <div className="container">
                <div className="rs-head">
                    <span className="eyebrow">Risultati</span>
                    {count > 0 && (
                        <div className="rs-count">
                            <strong>{count}</strong>
                            <span>
                                {count === 1 ? 'sagra trovata' : 'sagre trovate'}
                            </span>
                        </div>
                    )}
                </div>

                {count > 0 ? (
                    <div className="rs-grid">
                        {props.festivals.map(festival => (
                            <SearchResult
                                key={festival.slug}
                                festival={festival}
                            />
                        ))}
                    </div>
                ) : (
                    <span className="rs-empty">
                        Non sono state trovate sagre con questi criteri di
                        ricerca!
                    </span>
                )}
            </div>
        </section>
    )
}
