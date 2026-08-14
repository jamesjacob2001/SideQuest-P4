import { useState } from "react";
import PropTypes from "prop-types";

import styles from "./PasswordInput.module.css";

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        fill="none"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="M3 3l18 18M10.6 10.6a2.5 2.5 0 003.5 3.5M9.9 5.2A10 10 0 0112 5c5.5 0 9.5 3.5 11 7.5a11 11 0 01-4.1 5M6.1 6.1A11 11 0 001 12.5C2.5 16.5 6.5 20 12 20c1.6 0 3.1-.3 4.4-.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  autoComplete = "current-password",
  required = false,
  minLength,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.passwordField}>
      <input
        autoComplete={autoComplete}
        className={styles.input}
        id={id}
        minLength={minLength}
        onChange={onChange}
        required={required}
        type={isVisible ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={isVisible ? "Hide password" : "Show password"}
        className={styles.toggleButton}
        onClick={() => setIsVisible((current) => !current)}
        title={isVisible ? "Hide password" : "Show password"}
        type="button"
      >
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

PasswordInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  minLength: PropTypes.number,
};

export default PasswordInput;
