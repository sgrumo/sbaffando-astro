import { Autocomplete } from './autocomplete'

export const SearchContainer = () => {
    return (
        <form>
            <label>
                Parola chiave
                <input type="text" id="query" />
            </label>
            <Autocomplete />
            <label>
                Data di inizio
                <input type="date" id="startDate" />
            </label>
            <label>
                Data di fine
                <input type="date" id="endDate" />
            </label>
        </form>
    )
}
