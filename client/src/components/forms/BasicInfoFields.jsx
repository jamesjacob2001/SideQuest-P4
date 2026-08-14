import PropTypes from "prop-types";

import { FieldLabel } from "./FormFieldLabels.jsx";
import styles from "./ProfileForm.module.css";

function BasicInfoFields({ values, onChange }) {
  function updateField(field, value) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionHeading}>Basic info</h2>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FieldLabel htmlFor="profile-name" required>
            Name
          </FieldLabel>
          <input
            id="profile-name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            type="text"
            value={values.name}
          />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="profile-username" required>
            Username
          </FieldLabel>
          <input
            id="profile-username"
            onChange={(event) => updateField("username", event.target.value)}
            required
            type="text"
            value={values.username}
          />
        </div>
      </div>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-email" required>
          Email
        </FieldLabel>
        <input
          id="profile-email"
          onChange={(event) => updateField("email", event.target.value)}
          required
          type="email"
          value={values.email}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
        <textarea
          id="profile-bio"
          onChange={(event) => updateField("bio", event.target.value)}
          value={values.bio}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-location">Location</FieldLabel>
        <input
          id="profile-location"
          onChange={(event) => updateField("location", event.target.value)}
          type="text"
          value={values.location}
        />
      </div>
    </section>
  );
}

BasicInfoFields.propTypes = {
  values: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BasicInfoFields;
