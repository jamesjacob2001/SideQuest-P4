import PropTypes from "prop-types";

import styles from "./DashboardSection.module.css";

function DashboardSection({
  title,
  description,
  children,
  emptyMessage,
  isEmpty,
  variant = "default",
}) {
  return (
    <section className={styles.section} data-variant={variant}>
      <header className={styles.header}>
        <h2>{title}</h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </header>

      {isEmpty ? <p className={styles.empty}>{emptyMessage}</p> : children}
    </section>
  );
}

DashboardSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
  emptyMessage: PropTypes.string,
  isEmpty: PropTypes.bool,
  variant: PropTypes.oneOf([
    "default",
    "requests",
    "applications",
    "joined",
    "recruiting",
    "active",
    "paused",
    "finished",
    "owned",
  ]),
};

export default DashboardSection;
