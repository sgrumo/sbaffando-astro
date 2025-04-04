import type { Festival } from '../../lib/models/api/festival'

type SearchResultsProps = {
    festivals: Festival[]
}

export const SearchResults = (props: SearchResultsProps) => {
    return (
        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 md:gap-x-4 lg:grid-cols-4">
            {props.festivals.length > 0 &&
                props.festivals.map(festival => (
                    <div className="flex items-center gap-x-2 rounded-2xl border-1 border-solid border-black px-2 py-1 break-words">
                        <img
                            src="/src/assets/logo.svg"
                            width={16}
                            height={16}
                            alt=""
                        />
                        <a
                            className="underline visited:text-green-900"
                            href={`trippas/${festival.slug}`}
                            data-astro-prefetch
                        >
                            {festival.title}
                        </a>
                    </div>
                ))}
            {props.festivals.length === 0 && <span>NO FUCKIN FESTIVALS</span>}
        </div>
    )
}
