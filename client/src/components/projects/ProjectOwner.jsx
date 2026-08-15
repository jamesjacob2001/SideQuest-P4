import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { buildProfileAvatarUrl } from "../profiles/buildProfileAvatarUrl.js";
import styles from "./ProjectOwner.module.css";

function ProjectOwner({ owner, variant = "default" }) {
  if (!owner?._id || !owner?.name) {
    return null;
  }

  const avatarUrl = buildProfileAvatarUrl(owner.name);
  const isFeatured = variant === "featured";

  return (
    <Link
      className={`${styles.owner}${isFeatured ? ` ${styles.featured}` : ""}`}
      to={`/profile/${owner._id}`}
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
};

export default ProjectOwner;
