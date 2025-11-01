import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { match } from 'ts-pattern'
import type { Festival } from '../../lib/models/api/festival'
import type { Address } from '../../lib/models/api/geoapify'
import type { StrapiPaginatedResponse } from '../../lib/models/api/strapi'
import {
    SearchFormSchema,
    type SearchFormData,
} from '../../lib/models/forms/schemas'
import { ResultType, type Result } from '../../lib/utils/algebraic'
import { Autocomplete } from './autocomplete'

const defaultValues = {
    query: '',
    endDate: '',
    startDate: '',
}

type SearchFormProps = {
    handleSubmit: (
        searchFormData: SearchFormData,
    ) => Promise<Result<StrapiPaginatedResponse<Festival>>>
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
        formState: { isValid, errors, isDirty, isSubmitting },
    } = useForm<SearchFormData>({
        mode: 'onChange',
        resolver: zodResolver(SearchFormSchema),
        criteriaMode: 'all',
        defaultValues,
    })

    const onSubmit: SubmitHandler<SearchFormData> = async values => {
        const res = await props.handleSubmit(values)

        match(res).with({ resultType: ResultType.Error }, result => {
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

    // const hasErrors = Object.keys(errors).length > 0

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            onResetCapture={handleReset}
            onReset={() => clearErrors()}
            className="flex flex-col gap-y-3 p-4 md:gap-y-4 md:p-6"
        >
            <div className="flex flex-col">
                <label
                    htmlFor="query"
                    className="mb-1.5 text-sm font-semibold text-gray-900 md:text-base"
                >
                    Parola chiave
                </label>
                <input
                    className="rounded-lg border-2 border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none md:px-4 md:py-3 md:text-base"
                    type="text"
                    id="query"
                    placeholder="Es. pizza, arrosticini..."
                    {...register('query')}
                />
                {errors.query && (
                    <span className="mt-1 text-xs font-medium text-red-600 md:text-sm">
                        {errors.query.message}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px] md:gap-4">
                <div className="flex flex-col">
                    <label
                        htmlFor="location"
                        className="mb-1.5 text-sm font-semibold text-gray-900 md:text-base"
                    >
                        Posizione
                    </label>
                    <Autocomplete onResultClick={handleLocationResult} />
                    {errors.position && (
                        <span className="mt-1 text-xs font-medium text-red-600 md:text-sm">
                            {errors.position.message ||
                                errors.position.lat?.message ||
                                errors.position.lng?.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="radius"
                        className="mb-1.5 text-sm font-semibold text-gray-900 md:text-base"
                    >
                        Raggio (km)
                    </label>
                    <input
                        className="rounded-lg border-2 border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none md:px-4 md:py-3 md:text-base"
                        type="number"
                        id="radius"
                        placeholder="5"
                        defaultValue={5}
                        min={5}
                        max={100}
                        step={1}
                        {...register('radius')}
                    />
                    {errors.radius && (
                        <span className="mt-1 text-xs font-medium text-red-600 md:text-sm">
                            {errors.radius.message}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <div className="flex flex-col">
                    <label
                        htmlFor="startDate"
                        className="mb-1.5 text-sm font-semibold text-gray-900 md:text-base"
                    >
                        Data di inizio
                    </label>
                    <input
                        className="rounded-lg border-2 border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none md:px-4 md:py-3 md:text-base"
                        type="date"
                        id="startDate"
                        {...register('startDate')}
                    />
                    {errors.startDate && (
                        <span className="mt-1 text-xs font-medium text-red-600 md:text-sm">
                            {errors.startDate.message}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <label
                        htmlFor="endDate"
                        className="mb-1.5 text-sm font-semibold text-gray-900 md:text-base"
                    >
                        Data di fine
                    </label>
                    <input
                        className="rounded-lg border-2 border-gray-300 px-3 py-2.5 text-sm transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none md:px-4 md:py-3 md:text-base"
                        type="date"
                        id="endDate"
                        {...register('endDate')}
                    />
                    {errors.endDate && (
                        <span className="mt-1 text-xs font-medium text-red-600 md:text-sm">
                            {errors.endDate.message}
                        </span>
                    )}
                </div>
            </div>

            {errors.root && errors.root.message && (
                <div className="rounded border-l-4 border-red-500 bg-red-50 p-3 md:p-4">
                    <span className="text-sm font-medium text-red-700 md:text-base">
                        {errors.root.message}
                    </span>
                </div>
            )}

            <div className="flex gap-3 pt-2 md:gap-4 md:pt-4">
                <button
                    className="flex-1 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-300 active:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-base"
                    type="reset"
                    disabled={!isDirty || isSubmitting}
                >
                    Reset
                </button>
                <button
                    className="flex-1 rounded-lg bg-gray-400 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-500 active:bg-gray-600 enabled:bg-yellow-500 enabled:hover:bg-yellow-600 enabled:active:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50 md:px-6 md:py-3 md:text-base"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        </span>
                    ) : (
                        'Cerca'
                    )}
                </button>
            </div>
        </form>
    )
}
