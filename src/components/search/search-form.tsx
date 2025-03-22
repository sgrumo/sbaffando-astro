import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'preact/hooks'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { match } from 'ts-pattern'
import { getFestivals } from '../../lib/api/strapi'
import type { Address } from '../../lib/models/api/autocomplete'
import type { Festival } from '../../lib/models/api/festival'
import {
    SearchFormSchema,
    type SearchFormData,
} from '../../lib/models/forms/schemas'
import { ResultType } from '../../lib/utils/algebraic'
import { Autocomplete } from './autocomplete'

const defaultValues = {
    query: '',
    endDate: '',
    startDate: '',
}

export const SearchForm = () => {
    const [festivals, setFestivals] = useState<Festival[]>()

    const {
        handleSubmit,
        register,
        setValue,
        setError,
        clearErrors,
        watch,
        reset,
        formState: { isValid, errors, isDirty, isSubmitted },
    } = useForm<SearchFormData>({
        mode: 'onChange',
        resolver: zodResolver(SearchFormSchema),
        criteriaMode: 'all',
        defaultValues,
    })

    const onSubmit: SubmitHandler<SearchFormData> = async values => {
        const res = await getFestivals({ values })

        match(res)
            .with({ resultType: ResultType.Ok }, ({ result }) => {
                setFestivals(result.data)
            })
            .with({ resultType: ResultType.Error }, result => {
                setError('root', {
                    type: 'custom',
                    message: result.error,
                })
            })
    }

    const handleReset = () => {
        reset(defaultValues)
        clearErrors()
    }

    const handleLocationResult = ({ lat, lon }: Address) => {
        setValue('position.lat', lat, { shouldValidate: true })
        setValue('position.lng', lon, { shouldValidate: true })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            onResetCapture={handleReset}
            onReset={() => {
                clearErrors()
            }}
        >
            <label>
                Parola chiave
                <input type="text" id="query" {...register('query')} />
                {errors && errors.query && <span>{errors.query.message}</span>}
            </label>
            <Autocomplete onResultClick={handleLocationResult} />
            {errors && errors.position && (
                <span>{errors.position.message}</span>
            )}
            {errors && errors.position && errors.position.lat && (
                <span>{errors.position.lat.message}</span>
            )}
            {errors && errors.position && errors.position.lng && (
                <span>{errors.position.lng.message}</span>
            )}
            <label>
                Raggio (in km)
                <input
                    type="number"
                    id="radius"
                    min={5}
                    step={1}
                    {...register('radius')}
                />
            </label>
            {errors && errors.radius && <span>{errors.radius.message}</span>}
            <label>
                Data di inizio
                <input type="date" id="startDate" {...register('startDate')} />
                {errors && errors.startDate && (
                    <span>{errors.startDate.message}</span>
                )}
            </label>
            <label>
                Data di fine
                <input type="date" id="endDate" {...register('endDate')} />
                {errors && errors.endDate && (
                    <span>{errors.endDate.message}</span>
                )}
            </label>
            {errors && errors.root && errors.root.message}

            <button type="submit" disabled={!isValid}>
                Submit
            </button>
            <button type="reset" disabled={!isDirty}>
                Reset
            </button>
            {isSubmitted &&
                festivals &&
                festivals.map(festival => (
                    <a href={`trippas/${festival.slug}`} data-astro-prefetch>
                        {festival.title}
                    </a>
                ))}
            {isSubmitted && festivals && festivals.length === 0 && (
                <span>NO FUCKIN FESTIVALS</span>
            )}
            {festivals && errors && errors.root && errors.root.message && (
                <span>{errors.root.message}</span>
            )}
        </form>
    )
}
