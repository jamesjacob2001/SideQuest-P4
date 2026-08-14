import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { buildProfileAvatarUrl } from "../profiles/buildProfileAvatarUrl.js";
import { DASHBOARD_ORIGIN } from "../../utils/navigationOrigin.js";
import styles from "./MembershipListItem.module.css";

function MembershipListItem({
  membership,
  showApplicant,
  onAccept,
  onReject,
  onWithdraw,
  isUpdating,
  actionError,
}) {
  const project = membership.project;
  const applicant = membership.applicant;
  const projectId = project?._id;
  const showActions = Boolean(onAccept && onReject);
  const showWithdraw = Boolean(onWithdraw);

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
          {membership.roleTitle ? (
            <span>Role: {membership.roleTitle}</span>
          ) : null}
          {project.status ? <span>{project.status}</span> : null}
          {membership.status ? (
            <span className={styles.status}>{membership.status}</span>
          ) : null}
        </div>

        {actionError ? (
          <p className={styles.actionError} role="alert">
            {actionError}
          </p>
        ) : null}
      </div>

      <div className={styles.side}>
        {showApplicant && applicant?._id && applicant?.name ? (
          <Link className={styles.applicant} to={`/profile/${applicant._id}`}>
            <img
              alt={`${applicant.name} avatar`}
              className={styles.avatar}
              src={buildProfileAvatarUrl(applicant.name)}
            />
            <span>{applicant.name}</span>
          </Link>
        ) : null}

        {showActions ? (
          <div className={styles.actions}>
            <button
              className={styles.acceptButton}
              disabled={isUpdating}
              onClick={onAccept}
              type="button"
            >
              {isUpdating ? "Saving..." : "Accept"}
            </button>
            <button
              className={styles.rejectButton}
              disabled={isUpdating}
              onClick={onReject}
              type="button"
            >
              Decline
            </button>
          </div>
        ) : null}

        {showWithdraw ? (
          <button
            className={styles.withdrawButton}
            disabled={isUpdating}
            onClick={onWithdraw}
            type="button"
          >
            {isUpdating ? "Withdrawing..." : "Withdraw"}
          </button>
        ) : null}
      </div>
    </li>
  );
}

MembershipListItem.propTypes = {
  membership: PropTypes.shape({
    status: PropTypes.string,
    roleTitle: PropTypes.string,
    project: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      title: PropTypes.string,
      tagline: PropTypes.string,
      status: PropTypes.string,
    }),
    applicant: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      name: PropTypes.string,
    }),
  }).isRequired,
  showApplicant: PropTypes.bool,
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  isUpdating: PropTypes.bool,
  actionError: PropTypes.string,
  onWithdraw: PropTypes.func,
};

export default MembershipListItem;
