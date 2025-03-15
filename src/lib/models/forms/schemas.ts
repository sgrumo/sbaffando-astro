import { z } from 'zod'

export const SearchFormSchema = z.object({
    query: z.string().optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
})

export const AutocompleteSchema = z.object({
    query: z.string(),
})
