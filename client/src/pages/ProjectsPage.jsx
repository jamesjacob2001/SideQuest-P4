import { useEffect, useState } from "react";

import ProjectGrid from "../components/projects/ProjectGrid.jsx";
import { getProjects } from "../services/projectApi.js";
import styles from "./ProjectsPage.module.css";
import ProjectPagination from "../components/projects/ProjectPagination.jsx";

const PROJECTS_PER_PAGE = 24;

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
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

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const projectData = await getProjects(
          currentPage,
          PROJECTS_PER_PAGE,
          activeSearch,
        );

        setProjects(projectData.projects);
        setPagination(projectData.pagination);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, [currentPage, activeSearch]);

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
        {activeSearch ? (
          <>
            <h2>No projects match your search</h2>
            <p>
              Try a different title, technology, or category — or clear the
              search to browse all projects.
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
          <p className={styles.eyebrow}>Project discovery</p>
          <h1>Browse Projects</h1>
          <p className={styles.introduction}>
            Explore student projects, discover open roles, and find a team that
            matches your interests and skills.
          </p>
        </div>

        {!isLoading && !errorMessage && (
          <p className={styles.projectCount}>
            {pagination.totalProjects}{" "}
            {pagination.totalProjects === 1 ? "project" : "projects"}
            {activeSearch ? " found" : ""}
          </p>
        )}
      </header>

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
          placeholder="Search by title, description, technology, or category"
          maxLength={100}
        />
        <div className={styles.searchActions}>
          <button className={styles.searchButton} type="submit">
            Search
          </button>
          {activeSearch && (
            <button
              className={styles.clearButton}
              type="button"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {pageContent}
    </section>
  );
}

export default ProjectsPage;
