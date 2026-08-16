import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { createMembership } from "../../services/membershipApi.js";
import ui from "../../styles/ui.module.css";
import styles from "./ProjectRoleCard.module.css";

function ProjectRoleCard({ role, projectId, isAuthenticated, isOwner }) {
  const {
    roleId,
    title,
    description,
    requiredSkills = [],
    experienceLevel,
    totalPositions,
  } = role;

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationError, setApplicationError] = useState("");

  async function handleApply() {
    setApplicationError("");
    setIsApplying(true);

    try {
      await createMembership(projectId, roleId);
      setHasApplied(true);
    } catch (error) {
      setApplicationError(error.message);
    } finally {
      setIsApplying(false);
    }
  }

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>{title}</h3>

          {experienceLevel && (
            <p className={styles.experience}>{experienceLevel}</p>
          )}
        </div>

        <span className={styles.positions}>
          {totalPositions}{" "}
          {totalPositions === 1
            ? "collaborator needed"
            : "collaborators needed"}
        </span>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {requiredSkills.length > 0 && (
        <div className={styles.skillsSection}>
          <h4>Required skills</h4>

          <div className={styles.skillList}>
            {requiredSkills.map((skill) => (
              <span className={styles.skill} key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.applicationSection}>
        {!isAuthenticated ? (
          <Link className={ui.primaryButton} to="/login">
            Log in to request to join
          </Link>
        ) : isOwner ? (
          <p className={styles.ownerMessage}>You own this project!</p>
        ) : hasApplied ? (
          <p className={styles.successMessage} role="status">
            Application submitted successfully!
          </p>
        ) : (
          <button
            className={ui.primaryButton}
            type="button"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? "Sending request..." : "Request to join"}
          </button>
        )}

        {applicationError && (
          <p
            className={`${ui.errorBanner} ${styles.errorMessage}`}
            role="alert"
          >
            {applicationError}
          </p>
        )}
      </div>
    </article>
  );
}

ProjectRoleCard.propTypes = {
  role: PropTypes.shape({
    roleId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    requiredSkills: PropTypes.arrayOf(PropTypes.string),
    experienceLevel: PropTypes.string,
    totalPositions: PropTypes.number.isRequired,
  }).isRequired,
  projectId: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
};

export default ProjectRoleCard;
