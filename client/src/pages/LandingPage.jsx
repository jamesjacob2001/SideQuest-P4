import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import ui from "../styles/ui.module.css";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <section className={styles.hero}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.glowPrimary} />
        <span className={styles.glowAccent} />
        <span className={styles.stars} />
      </div>

      <div className={styles.content}>
        <p className={styles.brand}>SideQuest</p>
        <h1 className={styles.headline}>Find your next collaboration.</h1>
        <p className={styles.introduction}>
          Browse open projects across creative, community, and technical fields
          — then join a team that matches what you want to build.
        </p>
        <div className={styles.actions}>
          <Link className={ui.primaryButton} to="/projects">
            Browse projects
          </Link>
          <Link className={ui.secondaryButton} to="/register">
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
}

LandingPage.propTypes = {
  children: PropTypes.node,
};

export default LandingPage;
