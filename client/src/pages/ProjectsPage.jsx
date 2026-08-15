import { useEffect, useState } from "react";

import ProjectFilters, {
  EMPTY_FILTERS,
} from "../components/projects/ProjectFilters.jsx";
import ProjectGrid from "../components/projects/ProjectGrid.jsx";
import ProjectPagination from "../components/projects/ProjectPagination.jsx";
import { getProjects } from "../services/projectApi.js";
import ui from "../styles/ui.module.css";
import styles from "./ProjectsPage.module.css";

const PROJECTS_PER_PAGE = 24;

function hasActiveFilters(filters) {
  return Object.values(filters).some((value) => value !== "");
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PROJECTS_PER_PAGE,
    totalProjects: 0,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [areFiltersOpen, setAreFiltersOpen] = useState(false);

  const filtersActive = hasActiveFilters(filters);
  const queryActive = Boolean(activeSearch) || filtersActive;
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const projectData = await getProjects(currentPage, PROJECTS_PER_PAGE, {
          search: activeSearch,
          ...filters,
        });

        setProjects(projectData.projects);
        setPagination(projectData.pagination);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, [currentPage, activeSearch, filters]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    setCurrentPage(1);
    setActiveSearch(nextSearch);
  }

  function handleClearSearch() {
    setSearchInput("");
    setCurrentPage(1);
    setActiveSearch("");
  }

  function handleFilterChange(name, value) {
    setCurrentPage(1);
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleClearFilters() {
    setCurrentPage(1);
    setFilters(EMPTY_FILTERS);
  }

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      nextPage > pagination.totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    setCurrentPage(nextPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  let pageContent;

  if (isLoading) {
    pageContent = (
      <div className={styles.message} role="status">
        Loading projects...
      </div>
    );
  } else if (errorMessage) {
    pageContent = (
      <div className={styles.errorMessage} role="alert">
        <h2>Projects could not be loaded</h2>
        <p>{errorMessage}</p>
      </div>
    );
  } else if (projects.length === 0) {
    pageContent = (
      <div className={styles.message}>
        {queryActive ? (
          <>
            <h2>No projects match your filters</h2>
            <p>
              Try adjusting search or filters — or clear them to browse all
              projects.
            </p>
          </>
        ) : (
          <>
            <h2>No projects are currently available</h2>
            <p>Check back later or create the first SideQuest project.</p>
          </>
        )}
      </div>
    );
  } else {
    pageContent = (
      <>
        <ProjectGrid projects={projects} />

        <ProjectPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          hasPreviousPage={pagination.hasPreviousPage}
          hasNextPage={pagination.hasNextPage}
          onPageChange={handlePageChange}
        />
      </>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={ui.eyebrow}>Project discovery</p>
          <h1 className={ui.pageTitle}>Browse Projects</h1>
          <p className={ui.pageIntro}>
            Explore open projects looking for teammates — filter by skills,
            location, and commitment to find a fit.
          </p>
        </div>

        <div className={styles.headerActions}>
          {!isLoading && !errorMessage && (
            <p className={styles.projectCount}>
              {pagination.totalProjects}{" "}
              {pagination.totalProjects === 1 ? "project" : "projects"}
              {queryActive ? " found" : ""}
            </p>
          )}
        </div>
      </header>

      <div className={styles.discoveryTools}>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <label className={styles.visuallyHidden} htmlFor="project-search">
            Search projects
          </label>
          <input
            id="project-search"
            className={styles.searchInput}
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by title, description, skill, or category"
            maxLength={100}
          />
          <div className={styles.searchActions}>
            <button className={ui.primaryButton} type="submit">
              Search
            </button>
            <button
              className={`${styles.filterToggle}${
                areFiltersOpen || filtersActive
                  ? ` ${styles.filterToggleActive}`
                  : ""
              }`}
              type="button"
              aria-expanded={areFiltersOpen}
              aria-controls="project-filters"
              aria-label={
                areFiltersOpen ? "Hide project filters" : "Show project filters"
              }
              title="Filters"
              onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
            >
              <svg
                className={styles.filterIcon}
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {filtersActive && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>
            {activeSearch && (
              <button
                className={ui.mutedButton}
                type="button"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {areFiltersOpen && (
          <div id="project-filters">
            <ProjectFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              hasActiveFilters={filtersActive}
            />
          </div>
        )}
      </div>

      <div className={styles.results}>{pageContent}</div>
    </section>
  );
}

export default ProjectsPage;
