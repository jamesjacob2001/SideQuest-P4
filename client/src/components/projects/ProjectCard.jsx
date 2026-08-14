import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { PROJECTS_ORIGIN } from "../../utils/navigationOrigin.js";
import ProjectOwner from "./ProjectOwner.jsx";
import styles from "./ProjectCard.module.css";

function calculateTotalPositions(roles) {
  return roles.reduce((total, role) => total + (role.totalPositions ?? 0), 0);
}

function ProjectCard({ project }) {
  const {
    _id,
    title,
    tagline,
    categories = [],
    technologies = [],
    roles = [],
    locationType,
    status,
    owner,
  } = project;

  const totalPositions = calculateTotalPositions(roles);
  const visibleTechnologies = technologies.slice(0, 4);
  const additionalTechnologyCount =
    technologies.length - visibleTechnologies.length;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.status}>{status}</span>
        <span className={styles.location}>{locationType}</span>
      </div>

      <div className={styles.content}>
        <div>
          <h2 className={styles.title}>
            <Link state={PROJECTS_ORIGIN} to={`/projects/${_id}`}>
              {title}
            </Link>
          </h2>

          <p className={styles.tagline}>{tagline}</p>

          {owner ? (
            <div className={styles.ownerRow}>
              <ProjectOwner owner={owner} />
            </div>
          ) : null}
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Categories</h3>

          <div className={styles.tagList}>
            {categories.map((category) => (
              <span className={styles.categoryTag} key={category}>
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Technologies</h3>

          <div className={styles.tagList}>
            {visibleTechnologies.map((technology) => (
              <span className={styles.technologyTag} key={technology}>
                {technology}
              </span>
            ))}

            {additionalTechnologyCount > 0 && (
              <span className={styles.moreTag}>
                +{additionalTechnologyCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          {roles.length} {roles.length === 1 ? "role" : "roles"}
        </span>

        <span>
          {totalPositions} {totalPositions === 1 ? "position" : "positions"}
        </span>

        <Link
          className={styles.detailsLink}
          state={PROJECTS_ORIGIN}
          to={`/projects/${_id}`}
        >
          View project
        </Link>
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string),
    technologies: PropTypes.arrayOf(PropTypes.string),
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        roleId: PropTypes.string,
        title: PropTypes.string,
        totalPositions: PropTypes.number,
      }),
    ),
    locationType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string,
      username: PropTypes.string,
      profileImageUrl: PropTypes.string,
    }),
  }).isRequired,
};

export default ProjectCard;
