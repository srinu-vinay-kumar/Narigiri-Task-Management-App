import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="pagination__icon" />
      </button>

      <span className="pagination__status">
        Page {page} of {lastPage}
      </span>

      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= lastPage}
        aria-label="Next page"
      >
        <ChevronRight className="pagination__icon" />
      </button>
    </div>
  );
};

export default Pagination;
