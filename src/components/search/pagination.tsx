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

    const baseButtonClass =
        'px-2.5 py-2 md:px-3 md:py-2 text-sm md:text-base font-medium transition-all duration-200 rounded-md'

    const regularButtonClass = `${baseButtonClass} text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`

    const activeButtonClass = `${baseButtonClass} bg-yellow-500 text-white font-bold hover:bg-yellow-600 active:bg-yellow-700`

    const navigationButtonClass = `${baseButtonClass} text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold`

    return (
        <nav
            aria-label={labels.navigationLabel || 'Pagination'}
            className="mt-6 flex justify-center py-4 md:mt-8"
        >
            <ul className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <li>
                    <button
                        onClick={() => handlePageClick(safePage - 1)}
                        type="button"
                        disabled={safePage === 1}
                        aria-label={labels.previous}
                        className={navigationButtonClass}
                    >
                        <span className="hidden sm:inline">&laquo;</span>
                        <span className="sm:hidden">‹</span>
                    </button>
                </li>

                {visiblePages[0] > 1 && (
                    <>
                        <li>
                            <button
                                type="button"
                                onClick={() => handlePageClick(1)}
                                aria-label={`${labels.pageLabel} 1`}
                                className={regularButtonClass}
                            >
                                1
                            </button>
                        </li>
                        {visiblePages[0] > 2 && (
                            <li className="px-1 text-gray-400">
                                <span aria-hidden="true">…</span>
                            </li>
                        )}
                    </>
                )}

                {/* Visible page numbers */}
                {visiblePages.map(page => (
                    <li key={page}>
                        <button
                            type="button"
                            onClick={() => handlePageClick(page)}
                            aria-label={`${labels.pageLabel} ${page}`}
                            aria-current={
                                page === safePage ? 'page' : undefined
                            }
                            className={
                                page === safePage
                                    ? activeButtonClass
                                    : regularButtonClass
                            }
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] <
                            totalPages - 1 && (
                            <li className="px-1 text-gray-400">
                                <span aria-hidden="true">…</span>
                            </li>
                        )}
                        <li>
                            <button
                                type="button"
                                onClick={() => handlePageClick(totalPages)}
                                aria-label={`${labels.pageLabel} ${totalPages}`}
                                className={regularButtonClass}
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
                        className={navigationButtonClass}
                    >
                        <span className="hidden sm:inline">»</span>
                        <span className="sm:hidden">›</span>
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default SearchPagination
