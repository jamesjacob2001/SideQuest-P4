import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { buildProfileAvatarUrl } from "../profiles/buildProfileAvatarUrl.js";
import styles from "./ProjectOwner.module.css";

function ProjectOwner({
  owner,
  variant = "default",
  linkState,
  showProfileAction = false,
}) {
  if (!owner?._id || !owner?.name) {
    return null;
  }

  const avatarUrl = buildProfileAvatarUrl(owner.name);
  const isFeatured = variant === "featured";
  const profilePath = `/profile/${owner._id}`;

  return (
    <div
      className={`${styles.ownerWrap}${isFeatured ? ` ${styles.featuredWrap}` : ""}`}
    >
      <Link
        className={`${styles.owner}${isFeatured ? ` ${styles.featured}` : ""}`}
        state={linkState}
        to={profilePath}
      >
        <img
          alt={`${owner.name} avatar`}
          className={styles.avatar}
          src={avatarUrl}
        />
        <div className={styles.identity}>
          <span className={styles.name}>
            {isFeatured ? <span className={styles.label}>By </span> : null}
            {owner.name}
          </span>
        </div>
      </Link>

      {showProfileAction ? (
        <Link
          className={styles.profileAction}
          state={linkState}
          to={profilePath}
        >
          View Owner Profile
        </Link>
      ) : null}
    </div>
  );
}

ProjectOwner.propTypes = {
  owner: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name: PropTypes.string,
    username: PropTypes.string,
    profileImageUrl: PropTypes.string,
  }),
  variant: PropTypes.oneOf(["default", "featured"]),
  linkState: PropTypes.shape({
    from: PropTypes.string,
    fromLabel: PropTypes.string,
  }),
  showProfileAction: PropTypes.bool,
};

export default ProjectOwner;
