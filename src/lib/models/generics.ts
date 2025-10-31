export const timings = ['Upcoming', 'Soon', 'Ongoing', 'Past', 'TBA'] as const
export type Timing = (typeof timings)[number]
