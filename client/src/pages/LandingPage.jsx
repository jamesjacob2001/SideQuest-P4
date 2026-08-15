import { Link } from "react-router-dom";

import ui from "../styles/ui.module.css";
import styles from "./LandingPage.module.css";

function LandingPage() {
  return (
    <section className={styles.page}>
      <p className={styles.brand}>SideQuest</p>
      <h1 className={styles.headline}>Build something worth sharing.</h1>
      <p className={ui.pageIntro}>
        Discover side projects, find collaborators across any field, and form
        teams around ideas that matter to you.
      </p>
      <div className={styles.actions}>
        <Link className={ui.primaryButton} to="/projects">
          Browse projects
        </Link>
        <Link className={ui.secondaryButton} to="/register">
          Sign up
        </Link>
      </div>
    </section>
  );
}

export default LandingPage;
