import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { PROJECTS_ORIGIN } from "../../utils/navigationOrigin.js";
import { PROJECT_STATUS_DESCRIPTIONS } from "../../constants/projectOptions.js";
import ui from "../../styles/ui.module.css";
import ProjectOwner from "./ProjectOwner.jsx";
import styles from "./ProjectCard.module.css";

function ProjectCard({ project }) {
  const {
    _id,
    title,
    tagline,
    categories = [],
    locationType,
    status,
    owner,
  } = project;

  const visibleCategories = categories.slice(0, 2);
  const extraCategoryCount = categories.length - visibleCategories.length;

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <div className={styles.identity}>
          <h2 className={styles.title}>
            <Link state={PROJECTS_ORIGIN} to={`/projects/${_id}`}>
              {title}
            </Link>
          </h2>

          <p className={styles.tagline}>{tagline}</p>

          <div className={styles.badges}>
            <span
              className={ui.statusBadge}
              data-status={status}
              title={PROJECT_STATUS_DESCRIPTIONS[status]}
            >
              {status}
            </span>
            <span className={styles.locationBadge}>{locationType}</span>
          </div>
        </div>

        {owner ? (
          <div className={styles.ownerBlock}>
            <ProjectOwner
              linkState={{
                from: `/projects/${_id}`,
                fromLabel: title,
              }}
              owner={owner}
              variant="featured"
            />
          </div>
        ) : null}

        {visibleCategories.length > 0 && (
          <div className={styles.tags}>
            {visibleCategories.map((category) => (
              <span className={styles.categoryTag} key={category}>
                {category}
              </span>
            ))}
            {extraCategoryCount > 0 ? (
              <span className={styles.moreTag}>+{extraCategoryCount}</span>
            ) : null}
          </div>
        )}
      </div>

      <div className={styles.footer}>
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
