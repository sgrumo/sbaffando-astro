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
        previous: 'Precedente',
        next: 'Successiva',
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
        <nav
            aria-label={labels.navigationLabel || 'Pagination'}
            className="mt-4 py-4"
        >
            <ul className="flex justify-center gap-x-1">
                <li>
                    <button
                        onClick={() => handlePageClick(safePage - 1)}
                        type="button"
                        disabled={safePage === 1}
                        aria-label={labels.previous}
                        className="cursor-pointer"
                    >
                        &laquo; {labels.previous}
                    </button>
                </li>

                {visiblePages[0] > 1 && (
                    <>
                        <li>
                            <button
                                type="button"
                                className="cursor-pointer"
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
                            className="cursor-pointer"
                            onClick={() => handlePageClick(page)}
                            aria-label={`${labels.pageLabel} ${page}`}
                            aria-current={
                                page === safePage ? 'page' : undefined
                            }
                            style={{
                                fontWeight:
                                    page === safePage ? 'bold' : 'normal',
                            }}
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
                                type="button"
                                onClick={() => handlePageClick(totalPages)}
                                aria-label={`${labels.pageLabel} ${totalPages}`}
                                className="cursor-pointer"
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
