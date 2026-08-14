import PropTypes from "prop-types";

import { FieldLabel } from "./FormFieldLabels.jsx";
import styles from "./ProfileForm.module.css";

function PortfolioFields({ values, onChange }) {
  function updateField(field, value) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionHeading}>Portfolio links</h2>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-github">GitHub</FieldLabel>
        <input
          id="profile-github"
          onChange={(event) => updateField("github", event.target.value)}
          type="url"
          value={values.github}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-linkedin">LinkedIn</FieldLabel>
        <input
          id="profile-linkedin"
          onChange={(event) => updateField("linkedin", event.target.value)}
          type="url"
          value={values.linkedin}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel htmlFor="profile-site">Personal site</FieldLabel>
        <input
          id="profile-site"
          onChange={(event) => updateField("personalSite", event.target.value)}
          type="url"
          value={values.personalSite}
        />
      </div>
    </section>
  );
}

PortfolioFields.propTypes = {
  values: PropTypes.shape({
    github: PropTypes.string.isRequired,
    linkedin: PropTypes.string.isRequired,
    personalSite: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PortfolioFields;
