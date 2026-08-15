import { useEffect, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import ProjectOwner from "../components/projects/ProjectOwner.jsx";
import ProjectRoleCard from "../components/projects/ProjectRoleCard.jsx";
import { PROJECT_STATUS_DESCRIPTIONS } from "../constants/projectOptions.js";
import { getProjectById, deleteProject } from "../services/projectApi.js";
import { getProjectBackNavigation } from "../utils/navigationOrigin.js";
import ui from "../styles/ui.module.css";
import styles from "./ProjectDetailsPage.module.css";

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const backNavigation = getProjectBackNavigation(location.state);

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus, setErrorStatus] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (error) {
        setErrorMessage(error.message);
        setErrorStatus(error.status);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  async function handleDeleteProject() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this project?",
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteProject(projectId);
      navigate(backNavigation.to);
    } catch (error) {
      setDeleteError(error.message);
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <section className={styles.message} role="status">
        Loading project...
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className={styles.message} role="alert">
        <h1>
          {errorStatus === 404
            ? "Project not found"
            : "Project could not be loaded"}
        </h1>

        <p>{errorMessage}</p>

        <Link className={ui.accentLink} to={backNavigation.to}>
          {backNavigation.shortLabel}
        </Link>
      </section>
    );
  }

  const {
    title,
    tagline,
    description = {},
    categories = [],
    customCategories = [],
    technologies = [],
    roles = [],
    locationType,
    location: projectLocation,
    status,
    experienceLevel,
    weeklyCommitment,
    duration,
    owner,
  } = project;

  const allCategories = [...categories, ...customCategories];
  const isOwner = currentUser?._id?.toString() === String(project.ownerId);
  const statusDescription = PROJECT_STATUS_DESCRIPTIONS[status];

  return (
    <main className={styles.page}>
      <Link className={ui.accentLink} to={backNavigation.to}>
        {backNavigation.label}
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.heroMain}>
            <div className={styles.identity}>
              <div className={styles.badges}>
                <span
                  className={ui.statusBadge}
                  data-status={status}
                  title={statusDescription}
                >
                  {status}
                </span>
                <span className={styles.metaBadge}>{locationType}</span>
              </div>

              <h1>{title}</h1>
              <p className={styles.tagline}>{tagline}</p>
            </div>

            {isOwner ? (
              <div className={styles.projectActions}>
                <Link
                  className={ui.primaryButton}
                  state={location.state}
                  to={`/projects/${projectId}/edit`}
                >
                  Edit Project
                </Link>

                <button
                  className={ui.dangerButton}
                  type="button"
                  onClick={handleDeleteProject}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Project"}
                </button>
              </div>
            ) : null}

            {deleteError && (
              <div className={styles.deleteError} role="alert">
                {deleteError}
              </div>
            )}
          </div>

          {owner ? (
            <div className={styles.ownerCard}>
              <ProjectOwner owner={owner} variant="featured" />
            </div>
          ) : null}
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <section className={styles.contentSection}>
            <h2>Project overview</h2>
            <p>{description.overview}</p>
          </section>

          <section className={styles.contentSection}>
            <h2>Who the team is looking for</h2>
            <p>{description.lookingFor}</p>
          </section>

          <section className={styles.contentSection}>
            <h2>Open roles</h2>
            <p className={styles.sectionHint}>
              Choose a role to apply — this is how you join the project.
            </p>

            <div className={styles.roleList}>
              {roles.map((role) => (
                <ProjectRoleCard
                  key={role.roleId ?? role.title}
                  role={role}
                  projectId={projectId}
                  isAuthenticated={isAuthenticated}
                  isOwner={isOwner}
                />
              ))}
            </div>
          </section>

          <section className={styles.contentSection}>
            <h2>Goals</h2>
            <p>{description.goals}</p>
          </section>

          <section className={styles.contentSection}>
            <h2>Current progress</h2>
            <p>{description.currentProgress}</p>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.sidebarCard}>
            <h2>Project details</h2>

            <dl className={styles.detailList}>
              <div>
                <dt>Status</dt>
                <dd>
                  {status}
                  {statusDescription ? (
                    <span className={styles.statusDescription}>
                      {" "}
                      — {statusDescription}
                    </span>
                  ) : null}
                </dd>
              </div>

              <div>
                <dt>Location type</dt>
                <dd>{locationType}</dd>
              </div>

              {projectLocation && (
                <div>
                  <dt>Location</dt>
                  <dd>{projectLocation}</dd>
                </div>
              )}

              {experienceLevel && (
                <div>
                  <dt>Experience level</dt>
                  <dd>{experienceLevel}</dd>
                </div>
              )}

              {weeklyCommitment && (
                <div>
                  <dt>Weekly commitment</dt>
                  <dd>{weeklyCommitment}</dd>
                </div>
              )}

              {duration && (
                <div>
                  <dt>Duration</dt>
                  <dd>{duration}</dd>
                </div>
              )}
            </dl>
          </section>

          {allCategories.length > 0 && (
            <section className={styles.sidebarCard}>
              <h2>Categories</h2>

              <div className={styles.tagList}>
                {allCategories.map((category) => (
                  <span className={styles.categoryTag} key={category}>
                    {category}
                  </span>
                ))}
              </div>
            </section>
          )}

          {technologies.length > 0 && (
            <section className={styles.sidebarCard}>
              <h2>Skills</h2>

              <div className={styles.tagList}>
                {technologies.map((technology) => (
                  <span className={styles.technologyTag} key={technology}>
                    {technology}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default ProjectDetailsPage;
