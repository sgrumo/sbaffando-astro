interface PaginationProps {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
    maxVisiblePages?: number
    labels?: {
        previous?: string
        next?: string
        pageLabel?: string
        navigationLabel?: string
    }
}

const SearchPagination = ({
    totalPages,
    currentPage,
    onPageChange,
    maxVisiblePages = 5,
    labels = {
        previous: 'Previous',
        next: 'Next',
        pageLabel: 'Go to page',
        navigationLabel: 'Pagination',
    },
}: PaginationProps) => {
    if (totalPages <= 0) return null

    const safePage = Math.max(1, Math.min(currentPage, totalPages))

    const getVisiblePageNumbers = (): number[] => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        let start = Math.max(1, safePage - Math.floor(maxVisiblePages / 2))
        let end = start + maxVisiblePages - 1

        if (end > totalPages) {
            end = totalPages
            start = Math.max(1, end - maxVisiblePages + 1)
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const visiblePages = getVisiblePageNumbers()

    const handlePageClick = (page: number) => {
        if (page !== safePage && page >= 1 && page <= totalPages) {
            onPageChange(page)
        }
    }

    return (
        <nav aria-label={labels.navigationLabel || 'Pagination'}>
            <ul className="flex gap-x-1">
                <li>
                    <button
                        onClick={() => handlePageClick(safePage - 1)}
                        type="button"
                        disabled={safePage === 1}
                        aria-label={labels.previous}
                        class="pagination-prev"
                    >
                        &laquo; {labels.previous}
                    </button>
                </li>

                {visiblePages[0] > 1 && (
                    <>
                        <li>
                            <button
                                type="button"
                                onClick={() => handlePageClick(1)}
                                aria-label={`${labels.pageLabel} 1`}
                            >
                                1
                            </button>
                        </li>
                        {visiblePages[0] > 2 && (
                            <li>
                                <span aria-hidden="true">&hellip;</span>
                            </li>
                        )}
                    </>
                )}

                {visiblePages.map(page => (
                    <li key={page}>
                        <button
                            type="button"
                            onClick={() => handlePageClick(page)}
                            aria-label={`${labels.pageLabel} ${page}`}
                            aria-current={
                                page === safePage ? 'page' : undefined
                            }
                            class={`pagination-link ${page === safePage ? 'is-current' : ''}`}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] <
                            totalPages - 1 && (
                            <li>
                                <span
                                    class="pagination-ellipsis"
                                    aria-hidden="true"
                                >
                                    &hellip;
                                </span>
                            </li>
                        )}
                        <li>
                            <button
                                onClick={() => handlePageClick(totalPages)}
                                aria-label={`${labels.pageLabel} ${totalPages}`}
                                class="pagination-link"
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                <li>
                    <button
                        type="button"
                        onClick={() => handlePageClick(safePage + 1)}
                        disabled={safePage === totalPages}
                        aria-label={labels.next}
                        class="pagination-next"
                    >
                        {labels.next} &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default SearchPagination
