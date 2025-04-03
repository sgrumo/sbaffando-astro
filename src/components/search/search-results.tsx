import type { Festival } from '../../lib/models/api/festival'

type SearchResultsProps = {
    festivals: Festival[]
}

export const SearchResults = (props: SearchResultsProps) => {
    return (
        <>
            {props.festivals.length > 0 &&
                props.festivals.map(festival => (
                    <a href={`trippas/${festival.slug}`} data-astro-prefetch>
                        {festival.title}
                    </a>
                ))}
            {props.festivals.length === 0 && <span>NO FUCKIN FESTIVALS</span>}
        </>
    )
}
