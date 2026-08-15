import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { PROJECT_STATUS_DESCRIPTIONS } from "../../constants/projectOptions.js";
import ui from "../../styles/ui.module.css";
import styles from "./ProfileProjectsList.module.css";

function ProfileProjectsList({ projects, navigationState }) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>Projects</h2>
        <p className={styles.empty}>No projects to show yet.</p>
      </section>
    );
  }

  const currentProjects = projects.filter(
    (project) => project.status !== "Finished",
  );
  const pastProjects = projects.filter(
    (project) => project.status === "Finished",
  );

  function renderList(items) {
    return (
      <ul className={styles.list}>
        {items.map((project) => (
          <li className={styles.item} key={String(project._id)}>
            <div className={styles.main}>
              <Link
                className={styles.title}
                state={navigationState}
                to={`/projects/${project._id}`}
              >
                {project.title}
              </Link>
              {project.tagline ? (
                <p className={styles.tagline}>{project.tagline}</p>
              ) : null}
              <div className={styles.meta}>
                {project.status ? (
                  <span
                    className={ui.statusBadge}
                    data-status={project.status}
                    title={PROJECT_STATUS_DESCRIPTIONS[project.status]}
                  >
                    {project.status}
                  </span>
                ) : null}
                {project.locationType ? (
                  <span>{project.locationType}</span>
                ) : null}
              </div>
            </div>
            <Link
              className={ui.secondaryButton}
              state={navigationState}
              to={`/projects/${project._id}`}
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Projects</h2>
      <p className={styles.intro}>
        Current and past projects this person owns — useful before you apply.
      </p>

      {currentProjects.length > 0 ? (
        <div className={styles.group}>
          <h3 className={styles.groupLabel}>Current</h3>
          {renderList(currentProjects)}
        </div>
      ) : null}

      {pastProjects.length > 0 ? (
        <div className={styles.group}>
          <h3 className={styles.groupLabel}>Past</h3>
          {renderList(pastProjects)}
        </div>
      ) : null}
    </section>
  );
}

ProfileProjectsList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      title: PropTypes.string.isRequired,
      tagline: PropTypes.string,
      status: PropTypes.string,
      locationType: PropTypes.string,
    }),
  ),
  navigationState: PropTypes.shape({
    from: PropTypes.string,
    fromLabel: PropTypes.string,
  }),
};

export default ProfileProjectsList;
