import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { DASHBOARD_ORIGIN } from "../../utils/navigationOrigin.js";
import { PROJECT_STATUS_DESCRIPTIONS } from "../../constants/projectOptions.js";
import ui from "../../styles/ui.module.css";
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
            <span
              className={ui.statusBadge}
              data-status={project.status}
              title={PROJECT_STATUS_DESCRIPTIONS[project.status]}
            >
              {project.status}
            </span>
          ) : null}
          {project.locationType ? <span>{project.locationType}</span> : null}
        </div>
      </div>

      <div className={styles.actions}>
        {showManageActions ? (
          <Link
            className={ui.primaryButton}
            state={DASHBOARD_ORIGIN}
            to={`/projects/${projectId}/edit`}
          >
            Edit
          </Link>
        ) : null}

        <Link
          className={showManageActions ? ui.secondaryButton : ui.primaryButton}
          state={DASHBOARD_ORIGIN}
          to={`/projects/${projectId}`}
        >
          View
        </Link>
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
