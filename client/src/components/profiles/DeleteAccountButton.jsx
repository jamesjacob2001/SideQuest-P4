import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth.js";
import { deleteUser } from "../../services/userApi.js";
import ui from "../../styles/ui.module.css";
import styles from "./DeleteAccountButton.module.css";

function DeleteAccountButton({ userId, userName }) {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${userName}'s account? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteUser(userId);
      clearAuth();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
      setIsDeleting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={ui.dangerButton}
        disabled={isDeleting}
        onClick={handleDelete}
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete account"}
      </button>

      {errorMessage ? (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

DeleteAccountButton.propTypes = {
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

export default DeleteAccountButton;
