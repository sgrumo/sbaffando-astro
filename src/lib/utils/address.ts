import dayjs from 'dayjs'
import { match } from 'ts-pattern'
import type { EnrichedFestival } from '../models/api/festival'

export const formatDate = (date: string): string => {
    return dayjs(date).format('DD/MM/YYYY')
}

export const formatSearchDescription = (festival: EnrichedFestival): string => {
    const sameDate = festival.startDate === festival.endDate

    const formattedDate = match(sameDate)
        .with(
            false,
            () =>
                `${formatDate(festival.startDate)} - ${formatDate(festival.endDate)}`,
        )
        .with(true, () => `${formatDate(festival.startDate)}`)
        .exhaustive()

    return `${formattedDate}${formatAddress(festival)}`
}
export const formatAddress = (festival: EnrichedFestival): string => {
    if (!festival.address) {
        return ''
    }

    return `, ${festival.address.city}`
}

export const formatCompleteAddress = (festival: EnrichedFestival): string => {
    if (!festival.address) {
        return ''
    }

    return `${festival.address.formatted}`
}
