import { z } from 'zod'

const PositionSchema = z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    radius: z.number().positive(),
})

export const SearchFormSchema = z
    .object({
        query: z.string().trim().toLowerCase().optional().or(z.literal('')),
        startDate: z.string().date().optional().or(z.literal('')),
        endDate: z.string().date().optional().or(z.literal('')),
        position: PositionSchema.optional(),
    })
    .refine(
        data => {
            return (
                (data.query !== undefined && data.query !== '') ||
                (data.endDate !== undefined && data.endDate !== '') ||
                (data.startDate !== undefined && data.startDate !== '') ||
                data.position !== undefined
            )
        },
        {
            message: 'DEVI METTERE QUALCOSA PER CERCARE CRETINO',
            path: ['query'],
        },
    )
export type SearchFormData = z.infer<typeof SearchFormSchema>
