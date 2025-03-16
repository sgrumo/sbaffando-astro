import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import {
    SearchFormSchema,
    type SearchFormData,
} from '../../lib/models/forms/schemas'
import { Autocomplete } from './autocomplete'

export const SearchForm = () => {
    const {
        handleSubmit,
        register,
        formState: { isValid, errors },
    } = useForm<SearchFormData>({
        mode: 'onChange',
        resolver: zodResolver(SearchFormSchema),
    })

    const onSubmit: SubmitHandler<SearchFormData> = async values => {
        console.log(values)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                Parola chiave
                <input type="text" id="query" {...register('query')} />
                {errors && errors.query && <span>{errors.query.message}</span>}
            </label>
            <Autocomplete />
            <label>
                Data di inizio
                <input type="date" id="startDate" {...register('startDate')} />
                {errors && errors.startDate && (
                    <span>errors.startDate.message</span>
                )}
            </label>
            <label>
                Data di fine
                <input type="date" id="endDate" {...register('endDate')} />
                {errors && errors.endDate && (
                    <span>errors.endDate.message</span>
                )}
            </label>
            <button type="submit" disabled={!isValid}>
                Submit
            </button>
        </form>
    )
}
