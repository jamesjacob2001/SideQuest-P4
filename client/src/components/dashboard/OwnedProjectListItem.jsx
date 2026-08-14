import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DASHBOARD_ORIGIN } from "../../utils/navigationOrigin.js";
import styles from "./OwnedProjectListItem.module.css";

function OwnedProjectListItem({ project, showManageActions }) {
  const projectId = project?._id;

  if (!projectId) {
    return null;
  }

  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <Link
          className={styles.title}
          state={DASHBOARD_ORIGIN}
          to={`/projects/${projectId}`}
        >
          {project.title}
        </Link>

        {project.tagline ? (
          <p className={styles.tagline}>{project.tagline}</p>
        ) : null}

        <div className={styles.meta}>
          {project.status ? (
            <span className={styles.status}>{project.status}</span>
          ) : null}
          {project.locationType ? <span>{project.locationType}</span> : null}
        </div>
      </div>

      <div className={styles.actions}>
        <Link
          className={styles.viewLink}
          state={DASHBOARD_ORIGIN}
          to={`/projects/${projectId}`}
        >
          View
        </Link>

        {showManageActions ? (
          <Link
            className={styles.editLink}
            state={DASHBOARD_ORIGIN}
            to={`/projects/${projectId}/edit`}
          >
            Edit
          </Link>
        ) : null}
      </div>
    </li>
  );
}

OwnedProjectListItem.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    title: PropTypes.string.isRequired,
    tagline: PropTypes.string,
    status: PropTypes.string,
    locationType: PropTypes.string,
  }).isRequired,
  showManageActions: PropTypes.bool,
};

export default OwnedProjectListItem;
