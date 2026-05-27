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
                badge: 'st-adesso',
                label: 'OHI, È ADESSO EH', //TODO: find a better translation
            }
        })
        .with('Upcoming', () => {
            return {
                badge: 'st-poco',
                label: 'OHHH MANCA POCO',
            }
        })
        .with('Past', () => {
            return {
                badge: 'st-finita',
                label: "NON C'È PIÙ",
            }
        })
        .with('Soon', () => {
            return {
                badge: 'st-quasi',
                label: 'È QUASI QUI',
            }
        })
        .with('TBA', () => {
            return {
                badge: 'st-tba',
                label: 'CHISSÀ QUANDO',
            }
        })
        .exhaustive()

    return (
        <a
            href={`/trippas/${festival.slug}`}
            data-umami-event={`Search Result Click${landing ? `[Landing] Clicked on ${festival.slug}` : 'Clicked on ${festival.slug}'}`}
            data-astro-prefetch
            className="rs-card"
        >
            <div className="rs-body">
                <h3 className="rs-name">
                    <span>{festival.title}</span>
                    <span className="emoji">
                        {emojiForFestival(festival.title)}
                    </span>
                </h3>
                <p className="rs-food">{formatSearchDescription(festival)}</p>
            </div>
            <div className="rs-foot">
                <span className={`rs-badge ${timingConf.badge}`}>
                    {timingConf.label}
                </span>
                <span className="arr">→</span>
            </div>
        </a>
    )
}
