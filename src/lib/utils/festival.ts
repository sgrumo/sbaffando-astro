import { match, P } from 'ts-pattern'
import type { Timing } from '../models/generics'

export const emojiForFestival = (title: string): string => {
    const lower = title.toLowerCase()

    return match(lower)
        .with(P.string.regex(/\b(san|sant[oai])\b/), () => '😇')
        .with(P.string.regex(/\bpizz[ae]?\b/), () => '🍕')
        .with(P.string.regex(/\blasagna?\b/), () => '🍝')

        .with(
            P.string.regex(/\b(pasta|spaghetti|penne|rigatoni)\b/),
            () => '🍝',
        )
        .with(P.string.regex(/\b(fungh[io]|porcin[io])\b/), () => '🍄')
        .with(P.string.regex(/\b(tartuf[io])\b/), () => '🍄‍🟫')
        .with(P.string.regex(/\b(cioccolato|chocolate|cacao)\b/), () => '🍫')
        .with(P.string.regex(/\b(vino|wine|enolog[ia])\b/), () => '🍷')
        .with(P.string.regex(/\b(birra|beer|luppolo)\b/), () => '🍺')
        .with(P.string.regex(/\b(gelato|dolc[ie]|torta)\b/), () => '🍦')
        .with(P.string.regex(/\b(zucca)\b/), () => '🎃')
        .with(P.string.regex(/\b(ran[ea]|rospie)\b/), () => '🐸')
        .with(
            P.string.regex(
                /\b(porcell[io]|maial[ei]|prosciutt[io]|salame|salumi|cotechin[io])\b/,
            ),
            () => '🍖',
        )
        .with(
            P.string.regex(/\b(formagg[io]|cheese|pecorino|parmigiano)\b/),
            () => '🧀',
        )
        .with(P.string.regex(/\b(pesce|fish|mare|frutti.*mare)\b/), () => '🐟')
        .with(P.string.regex(/\b(carne|meat|bistecca|grill)\b/), () => '🥩')
        .with(P.string.regex(/\b(autunno|fall|foglie)\b/), () => '🍂')
        .with(P.string.regex(/\bcastagn[ae]\b/), () => '🌰')
        .with(P.string.regex(/\b(olio|oliv[ae])\b/), () => '🫒')

        .otherwise(() => '🍽️')
}

export const getTimingFromTimeBounds = (
    startDate: string,
    endDate: string,
): Timing => {
    if (!startDate) {
        return 'TBA'
    }
    const start = new Date(startDate)
    const end = new Date(endDate)

    const now = new Date()
    const diffInMs = start.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays > 30) {
        return 'Upcoming'
    } else if (diffInDays >= 0 && diffInDays <= 30) {
        return 'Soon'
    } else if (now >= start && now <= end) {
        return 'Ongoing'
    } else {
        return 'Past'
    }
}
