type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "...")[] = [1];

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("...");

    pages.push(total);

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <div className="join">
            <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Halaman sebelumnya"
            >
                «
            </button>

            {pages.map((page, idx) =>
                page === "..." ? (
                    <button key={`ellipsis-${idx}`} className="join-item btn btn-sm btn-disabled">
                        ...
                    </button>
                ) : (
                    <button
                        key={page}
                        className={`join-item btn btn-sm ${currentPage === page ? "btn-active" : ""}`}
                        onClick={() => onPageChange(page)}
                        aria-current={currentPage === page ? "page" : undefined}
                    >
                        {page}
                    </button>
                ),
            )}

            <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Halaman berikutnya"
            >
                »
            </button>
        </div>
    );
}
