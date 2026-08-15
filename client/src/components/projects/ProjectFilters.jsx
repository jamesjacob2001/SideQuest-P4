import PropTypes from "prop-types";

import {
  EXPERIENCE_LEVELS,
  LOCATION_TYPES,
  PROJECT_CATEGORIES,
  PROJECT_STATUS_OPTIONS,
  TECHNOLOGY_OPTIONS,
} from "../../constants/projectOptions.js";
import styles from "./ProjectFilters.module.css";

const COMPENSATION_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
];

const EMPTY_FILTERS = {
  category: "",
  technology: "",
  status: "",
  locationType: "",
  experienceLevel: "",
  compensation: "",
};

function ProjectFilters({ filters, onChange, onClear, hasActiveFilters }) {
  function handleFilterChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>Filters</h2>
        {hasActiveFilters && (
          <button
            className={styles.clearFiltersButton}
            type="button"
            onClick={onClear}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className={styles.filterGrid}>
        <label className={styles.filterField} htmlFor="filter-category">
          <span>Category</span>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All categories</option>
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField} htmlFor="filter-technology">
          <span>Skill</span>
          <select
            id="filter-technology"
            name="technology"
            value={filters.technology}
            onChange={handleFilterChange}
          >
            <option value="">All skills</option>
            {TECHNOLOGY_OPTIONS.map((technology) => (
              <option key={technology} value={technology}>
                {technology}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField} htmlFor="filter-status">
          <span>Status</span>
          <select
            id="filter-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All statuses</option>
            {PROJECT_STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.value} — {status.description}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField} htmlFor="filter-location">
          <span>Location</span>
          <select
            id="filter-location"
            name="locationType"
            value={filters.locationType}
            onChange={handleFilterChange}
          >
            <option value="">All locations</option>
            {LOCATION_TYPES.map((locationType) => (
              <option key={locationType} value={locationType}>
                {locationType}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField} htmlFor="filter-experience">
          <span>Experience level</span>
          <select
            id="filter-experience"
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleFilterChange}
          >
            <option value="">All levels</option>
            {EXPERIENCE_LEVELS.map((experienceLevel) => (
              <option key={experienceLevel} value={experienceLevel}>
                {experienceLevel}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.filterField} htmlFor="filter-compensation">
          <span>Compensation</span>
          <select
            id="filter-compensation"
            name="compensation"
            value={filters.compensation}
            onChange={handleFilterChange}
          >
            <option value="">Paid or unpaid</option>
            {COMPENSATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

ProjectFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired,
    technology: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    locationType: PropTypes.string.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    compensation: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
};

export { EMPTY_FILTERS };
export default ProjectFilters;
