import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { match } from 'ts-pattern'
import { getFestivals } from '../../lib/api/strapi'
import type { Festival } from '../../lib/models/api/festival'
import type { Address } from '../../lib/models/api/geoapify'
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

type SearchFormProps = {
    onReceiveFestivals: (festivals: Festival[]) => void
    onReset: () => void
}

export const SearchForm = (props: SearchFormProps) => {
    const {
        handleSubmit,
        register,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { isValid, errors, isDirty },
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
                props.onReceiveFestivals(result.data)
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
        props.onReset()
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
            className="flex flex-col gap-y-2 lg:gap-y-4"
        >
            <label className="flex flex-col">
                Parola chiave
                <input
                    className="border-yellow-400"
                    type="text"
                    id="query"
                    {...register('query')}
                />
            </label>
            <div className="grid grid-cols-[76%_20%] gap-x-4">
                <Autocomplete onResultClick={handleLocationResult} />

                <label>
                    Raggio
                    <input
                        type="number"
                        id="radius"
                        placeholder="in km"
                        defaultValue={5}
                        min={5}
                        max={100}
                        step={1}
                        {...register('radius')}
                    />
                </label>
            </div>
            <div className="flex justify-between lg:justify-start lg:gap-x-4">
                <label>
                    Data di inizio
                    <input
                        type="date"
                        id="startDate"
                        {...register('startDate')}
                    />
                </label>
                <label>
                    Data di fine
                    <input type="date" id="endDate" {...register('endDate')} />
                </label>
            </div>
            <div class="flex gap-x-2">
                <button
                    className="w-full cursor-pointer rounded-2xl bg-gray-400 px-10 py-2 text-white valid:bg-black"
                    type="reset"
                    disabled={!isDirty}
                >
                    Reset
                </button>
                <button
                    className="w-full cursor-pointer rounded-2xl bg-gray-400 px-10 py-2 text-white valid:bg-yellow-400"
                    type="submit"
                    disabled={!isValid}
                >
                    Cerca
                </button>
            </div>
            {errors && errors.query && <span>{errors.query.message}</span>}

            {errors && errors.position && (
                <span>{errors.position.message}</span>
            )}
            {errors && errors.position && errors.position.lat && (
                <span>{errors.position.lat.message}</span>
            )}
            {errors && errors.position && errors.position.lng && (
                <span>{errors.position.lng.message}</span>
            )}
            {errors && errors.radius && <span>{errors.radius.message}</span>}
            {errors && errors.startDate && (
                <span>{errors.startDate.message}</span>
            )}
            {errors && errors.root && errors.root.message && (
                <span>{errors.root.message}</span>
            )}
            {errors && errors.endDate && <span>{errors.endDate.message}</span>}
        </form>
    )
}
