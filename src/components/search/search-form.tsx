import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'preact/hooks'
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
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)
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

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            setError('position', {
                type: 'custom',
                message: 'Geolocalizzazione non supportata dal browser',
            })
            return
        }

        setIsLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords
                setValue('position.lat', latitude, { shouldValidate: true })
                setValue('position.lng', longitude, { shouldValidate: true })
                clearErrors('position')
                setIsLoadingLocation(false)
            },
            error => {
                console.error('Geolocation error:', error)
                let errorMessage =
                    'Impossibile accedere alla posizione. Controlla i permessi.'

                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage =
                        'Permesso negato. Abilita la geolocalizzazione nelle impostazioni del browser.'
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = 'Posizione non disponibile. Prova più tardi.'
                } else if (error.code === error.TIMEOUT) {
                    errorMessage =
                        'Richiesta di posizione scaduta. Prova di nuovo.'
                }

                setError('position', {
                    type: 'custom',
                    message: errorMessage,
                })
                setIsLoadingLocation(false)
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 0,
            },
        )
    }

    // const hasErrors = Object.keys(errors).length > 0

    return (
        <section className="sf-section">
            <div className="container">
                <span className="eyebrow">Cerca</span>
                <h2 className="sf-title">
                    <span className="a">Cosa ti</span>
                    <span className="b">
                        va di <span className="scribble">mangiare?</span>
                    </span>
                </h2>
                <p className="sf-sub">
                    Dimmi tre cose. Ti mando al padellone più vicino.
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onResetCapture={handleReset}
                    onReset={() => clearErrors()}
                    className="sf-card"
                >
                    <div className="sf-row r1">
                        <div className="sf-field">
                            <label className="sf-label" htmlFor="query">
                                Ho voglia di…
                            </label>
                            <input
                                className="sf-input"
                                type="text"
                                id="query"
                                placeholder="tortelloni, porchetta, gnocco fritto…"
                                {...register('query')}
                            />
                            {errors.query && (
                                <span className="sf-error">
                                    {errors.query.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="sf-row r2">
                        <div className="sf-field">
                            <label className="sf-label" htmlFor="location">
                                Parto da
                            </label>
                            <Autocomplete
                                onResultClick={handleLocationResult}
                            />
                            {errors.position && (
                                <span className="sf-error">
                                    {errors.position.message ||
                                        errors.position.lat?.message ||
                                        errors.position.lng?.message}
                                </span>
                            )}
                        </div>

                        <div className="sf-field">
                            <label className="sf-label" htmlFor="radius">
                                Mi sposto di (km)
                            </label>
                            <input
                                className="sf-input"
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
                                <span className="sf-error">
                                    {errors.radius.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* TODO: "Ora e vicino" geolocation button temporarily
                        removed until it gives proper user feedback. The
                        handleGeolocation handler and isLoadingLocation state
                        are kept in place to restore it later.
                    <div className="sf-row r1">
                        <button
                            type="button"
                            className="sf-now"
                            onClick={handleGeolocation}
                            disabled={isLoadingLocation || isSubmitting}
                        >
                            {isLoadingLocation ? (
                                <>
                                    <span className="sf-spin"></span>
                                    Localizzazione...
                                </>
                            ) : (
                                <>
                                    <span className="ico">⌖</span> Ora e vicino
                                </>
                            )}
                        </button>
                    </div>
                    */}

                    <div className="sf-row r3">
                        <div className="sf-field">
                            <label className="sf-label" htmlFor="startDate">
                                Da quando
                            </label>
                            <input
                                className="sf-input"
                                type="date"
                                id="startDate"
                                {...register('startDate')}
                            />
                            {errors.startDate && (
                                <span className="sf-error">
                                    {errors.startDate.message}
                                </span>
                            )}
                        </div>

                        <div className="sf-field">
                            <label className="sf-label" htmlFor="endDate">
                                Fino a
                            </label>
                            <input
                                className="sf-input"
                                type="date"
                                id="endDate"
                                {...register('endDate')}
                            />
                            {errors.endDate && (
                                <span className="sf-error">
                                    {errors.endDate.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {errors.root && errors.root.message && (
                        <div className="sf-row r1">
                            <div className="sf-error-box">
                                {errors.root.message}
                            </div>
                        </div>
                    )}

                    <div className="sf-actions">
                        <button
                            className="sf-reset"
                            type="reset"
                            disabled={!isDirty || isSubmitting}
                        >
                            Reset
                        </button>
                        <button
                            className="sf-go"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="sf-spin"></span>
                            ) : (
                                <>
                                    Portami al padellone
                                    <span className="arr">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}
