import { match } from 'ts-pattern'
import type { EnrichedFestival } from '../../lib/models/api/festival'
import { formatSearchDescription } from '../../lib/utils/address'
import {
    emojiForFestival,
    getTimingFromTimeBounds,
} from '../../lib/utils/festival'

type SearchResultProps = {
    festival: EnrichedFestival
    landing?: boolean
}
export const SearchResult = ({ festival, landing }: SearchResultProps) => {
    const timing = getTimingFromTimeBounds(festival.startDate, festival.endDate)

    const timingConf = match(timing)
        .with('Ongoing', () => {
            return {
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'OHI, È ADESSO EH', //TODO: find a better translation
            }
        })
        .with('Upcoming', () => {
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                label: 'OHHH MANCA POCO',
            }
        })
        .with('Past', () => {
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-600',
                label: "NON C'È PIÙ",
            }
        })
        .with('Soon', () => {
            return {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                label: 'È QUASI QUI',
            }
        })
        .with('TBA', () => {
            return {
                bg: 'bg-amber-100',
                text: 'text-amber-800',
                label: 'CHISSÀ QUANDO',
            }
        })
        .exhaustive()

    return (
        <a
            href={`/trippas/${festival.slug}`}
            data-umami-event={`Search Result Click${landing ? `[Landing] Clicked on ${festival.slug}` : 'Clicked on ${festival.slug}'}`}
            data-astro-prefetch
            className="group md:h-full"
        >
            <div className="relative flex min-w-0 flex-1 flex-col gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-orange-400 hover:shadow-md md:h-full">
                <div class="grid grid-cols-[90%_10%] gap-2">
                    <h3 className="line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-orange-600">
                        {festival.title}
                    </h3>
                    <span className="shrink-0 text-xl">
                        {emojiForFestival(festival.title)}
                    </span>
                </div>

                <p className="text-sm text-gray-600">
                    {formatSearchDescription(festival)}
                </p>

                <span
                    className={`mt-auto flex shrink-0 items-center justify-center rounded px-2 py-1 text-xs font-semibold ${timingConf.bg} ${timingConf.text}`}
                >
                    {timingConf.label}
                </span>
            </div>
        </a>
    )
}
