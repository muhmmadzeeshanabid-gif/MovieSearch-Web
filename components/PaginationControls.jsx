import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const maxVisible = 5;
  const capped = Math.min(totalPages, 500);

  const getPages = () => {
    const pages = [];

    if (capped <= maxVisible + 2) {
      for (let pageNumber = 1; pageNumber <= capped; pageNumber += 1) {
        pages.push(pageNumber);
      }
      return pages;
    }

    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(capped - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pages.push(pageNumber);
    }

    if (end < capped - 1) {
      pages.push("...");
    }

    pages.push(capped);
    return pages;
  };

  if (capped <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>

      {getPages().map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
              pageNumber === currentPage
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {pageNumber}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= capped}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-30 disabled:pointer-events-none"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
