import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import ui from "../styles/ui.module.css";
import styles from "./AuthPages.module.css";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/projects";
  const authMessage = location.state?.authMessage;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(redirectTo);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={ui.eyebrow}>Account</p>
        <h1 className={ui.pageTitleCompact}>Log in</h1>
        <p className={ui.pageIntro}>
          Sign in to apply to roles, create projects, and manage your teams.
        </p>
      </header>

      {authMessage ? (
        <p className={ui.infoBanner} role="status">
          {authMessage}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        {errorMessage ? (
          <p className={ui.errorBanner} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className={styles.field}>
          <label htmlFor="login-email">Email</label>
          <input
            autoComplete="email"
            className={ui.textInput}
            id="login-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="login-password">Password</label>
          <PasswordInput
            autoComplete="current-password"
            id="login-password"
            onChange={(event) => setPassword(event.target.value)}
            required
            value={password}
          />
        </div>

        <button
          className={ui.primaryButton}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className={styles.footerText}>
        Need an account?{" "}
        <Link className={ui.accentLink} state={location.state} to="/register">
          Sign up
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
