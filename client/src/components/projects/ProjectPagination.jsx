import PropTypes from "prop-types";

import styles from "./ProjectPagination.module.css";

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 3);
    pages.add(totalPages - 2);
    pages.add(totalPages - 1);
  }

  const sortedPages = [...pages].sort((left, right) => left - right);
  const items = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const page = sortedPages[index];

    if (index > 0 && page - sortedPages[index - 1] > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  }

  return items;
}

function ProjectPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = buildPageItems(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Project pages">
      <button
        aria-label="Previous page"
        className={styles.button}
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPreviousPage}
      >
        ← Previous
      </button>

      <ul className={styles.pageList}>
        {pageItems.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li
                aria-hidden="true"
                className={styles.ellipsis}
                key={`ellipsis-${index}`}
              >
                …
              </li>
            );
          }

          const isCurrentPage = item === page;

          return (
            <li key={item}>
              <button
                aria-current={isCurrentPage ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={`${styles.pageButton}${
                  isCurrentPage ? ` ${styles.pageButtonActive}` : ""
                }`}
                disabled={isCurrentPage}
                onClick={() => onPageChange(item)}
                type="button"
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        aria-label="Next page"
        className={styles.button}
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next →
      </button>
    </nav>
  );
}

ProjectPagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default ProjectPagination;
