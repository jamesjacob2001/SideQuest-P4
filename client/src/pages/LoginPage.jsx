import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import PasswordInput from "../components/forms/PasswordInput.jsx";
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
        <p className={styles.eyebrow}>Account</p>
        <h1>Log in</h1>
        <p className={styles.introduction}>
          Sign in to edit your profile and create projects.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        {errorMessage ? (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className={styles.field}>
          <label htmlFor="login-email">Email</label>
          <input
            autoComplete="email"
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
          className={styles.submitButton}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className={styles.footerText}>
        Need an account? <Link to="/register">Sign up</Link>
      </p>
    </section>
  );
}

export default LoginPage;
