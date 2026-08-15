import PropTypes from "prop-types";

import {
  EXPERIENCE_LEVELS,
  LOCATION_TYPES,
  PROJECT_CATEGORIES,
  PROJECT_DURATIONS,
  TECHNOLOGY_OPTIONS,
  WEEKLY_COMMITMENTS,
} from "../../constants/projectOptions.js";
import styles from "./ProjectFilters.module.css";

const EMPTY_FILTERS = {
  category: "",
  technology: "",
  locationType: "",
  experienceLevel: "",
  weeklyCommitment: "",
  duration: "",
};

function ProjectFilters({ filters, onChange, onClear, hasActiveFilters }) {
  function handleFilterChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  return (
    <div className={styles.filters}>
      <div className={styles.filtersHeader}>
        <div>
          <h2 className={styles.filtersTitle}>Filters</h2>
        </div>
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

      <div className={styles.filterGroups}>
        <section className={styles.filterGroup} aria-labelledby="filter-topic">
          <h3 className={styles.groupTitle} id="filter-topic">
            Topic
          </h3>
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
          </div>
        </section>

        <section
          className={styles.filterGroup}
          aria-labelledby="filter-logistics"
        >
          <h3 className={styles.groupTitle} id="filter-logistics">
            Logistics
          </h3>
          <div className={styles.filterGridWide}>
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

            <label className={styles.filterField} htmlFor="filter-commitment">
              <span>Weekly commitment</span>
              <select
                id="filter-commitment"
                name="weeklyCommitment"
                value={filters.weeklyCommitment}
                onChange={handleFilterChange}
              >
                <option value="">Any commitment</option>
                {WEEKLY_COMMITMENTS.map((commitment) => (
                  <option key={commitment} value={commitment}>
                    {commitment}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterField} htmlFor="filter-duration">
              <span>Duration</span>
              <select
                id="filter-duration"
                name="duration"
                value={filters.duration}
                onChange={handleFilterChange}
              >
                <option value="">Any duration</option>
                {PROJECT_DURATIONS.map((projectDuration) => (
                  <option key={projectDuration} value={projectDuration}>
                    {projectDuration}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

ProjectFilters.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired,
    technology: PropTypes.string.isRequired,
    locationType: PropTypes.string.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    weeklyCommitment: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
};

export { EMPTY_FILTERS };
export default ProjectFilters;
