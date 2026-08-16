import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import { useAuth } from "../auth/useAuth.js";
import ui from "../../styles/ui.module.css";
import styles from "./Navbar.module.css";

function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Keep navbar usable even if logout request fails.
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <NavLink className={styles.brand} to="/projects">
          SideQuest
        </NavLink>

        <div className={styles.links}>
          <div className={styles.primaryLinks}>
            <NavLink to="/projects">Browse</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            {isAuthenticated ? (
              <NavLink to={`/profile/${user._id}`}>Profile</NavLink>
            ) : null}
          </div>

          {!isLoading && (
            <div className={styles.accountLinks}>
              {isAuthenticated ? (
                <>
                  <NavLink
                    className={`${ui.primaryButton} ${styles.navCta}`}
                    to="/projects/new"
                  >
                    Create project
                  </NavLink>
                  <button
                    className={`${ui.mutedButton} ${styles.navMuted}`}
                    onClick={handleLogout}
                    type="button"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink className={styles.quietLink} to="/login">
                    Log in
                  </NavLink>
                  <NavLink
                    className={`${ui.primaryButton} ${styles.navCta}`}
                    to="/register"
                  >
                    Sign up
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  children: PropTypes.node,
};

export default Navbar;
