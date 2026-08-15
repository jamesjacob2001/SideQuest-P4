import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/useAuth.js";
import PasswordInput from "../components/forms/PasswordInput.jsx";
import styles from "./AuthPages.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from;
  const authMessage = location.state?.authMessage;

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const user = await register({
        name,
        username,
        email,
        password,
      });

      navigate(redirectTo || `/profile/${user._id}`);
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
        <h1>Create an account</h1>
        <p className={styles.introduction}>
          Join SideQuest to collaborate on projects across any field.
        </p>
      </header>

      {authMessage ? (
        <p className={styles.infoMessage} role="status">
          {authMessage}
        </p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        {errorMessage ? (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <div className={styles.field}>
          <label htmlFor="register-name">Name</label>
          <input
            autoComplete="name"
            id="register-name"
            onChange={(event) => setName(event.target.value)}
            required
            type="text"
            value={name}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-username">Username</label>
          <input
            autoComplete="username"
            id="register-username"
            onChange={(event) => setUsername(event.target.value)}
            required
            type="text"
            value={username}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-email">Email</label>
          <input
            autoComplete="email"
            id="register-email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="register-password">Password</label>
          <PasswordInput
            autoComplete="new-password"
            id="register-password"
            minLength={8}
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
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className={styles.footerText}>
        Already have an account?{" "}
        <Link state={location.state} to="/login">
          Log in
        </Link>
      </p>
    </section>
  );
}

export default RegisterPage;
