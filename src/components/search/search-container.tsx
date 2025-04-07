import { useState } from 'preact/hooks'
import { match } from 'ts-pattern'
import { DEFAULT_PAGE_SIZE } from '../../lib/api/const'
import { getFestivals } from '../../lib/api/strapi'
import type { Festival } from '../../lib/models/api/festival'
import {
    type Pagination,
    type StrapiPaginatedResponse,
} from '../../lib/models/api/strapi'
import type { SearchFormData } from '../../lib/models/forms/schemas'
import { ResultType, type Result } from '../../lib/utils/algebraic'
import SearchPagination from './pagination'
import { SearchForm } from './search-form'
import { SearchResults } from './search-results'

export const SearchContainer = () => {
    const [pagination, setPagination] = useState<Pagination>()
    const [festivals, setFestivals] = useState<Festival[]>()
    const [searchValues, setSearchValues] = useState<SearchFormData>()

    const handleReset = () => {
        setFestivals(undefined)
    }

    const onHandleSubmit = async (
        values: SearchFormData,
    ): Promise<Result<StrapiPaginatedResponse<Festival>>> => {
        const res = await getFestivals({
            values,
            pagination: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
        })
        setSearchValues(values)
        match(res).with({ resultType: ResultType.Ok }, ({ result }) => {
            setFestivals(result.data)
            setPagination(result.meta.pagination)
        })
        return res
    }

    const handlePageChange = async (page: number) => {
        const res = await getFestivals({
            values: searchValues!,
            pagination: { page, pageSize: DEFAULT_PAGE_SIZE },
        })
        match(res).with({ resultType: ResultType.Ok }, ({ result }) => {
            setFestivals(result.data)
            setPagination(result.meta.pagination)
        })
        return res
    }
    return (
        <>
            <SearchForm onReset={handleReset} handleSubmit={onHandleSubmit} />
            {festivals !== undefined && <SearchResults festivals={festivals} />}
            {festivals !== undefined &&
                pagination !== undefined &&
                pagination.pageCount > 1 && (
                    <SearchPagination
                        totalPages={pagination.pageCount}
                        currentPage={pagination.page}
                        onPageChange={handlePageChange}
                    />
                )}
        </>
    )
}
