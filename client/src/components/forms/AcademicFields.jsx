import PropTypes from "prop-types";

import { YEAR_LABELS } from "../../constants/userOptions.js";
import { FieldLabel } from "./FormFieldLabels.jsx";
import styles from "./ProfileForm.module.css";

function AcademicFields({ values, onChange }) {
  function updateField(field, value) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionHeading}>Academics</h2>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FieldLabel htmlFor="profile-university">University</FieldLabel>
          <input
            id="profile-university"
            onChange={(event) => updateField("university", event.target.value)}
            type="text"
            value={values.university}
          />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="profile-major">Major / focus</FieldLabel>
          <input
            id="profile-major"
            onChange={(event) => updateField("major", event.target.value)}
            type="text"
            value={values.major}
          />
        </div>
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FieldLabel htmlFor="profile-year-label">Year</FieldLabel>
          <select
            id="profile-year-label"
            onChange={(event) => updateField("yearLabel", event.target.value)}
            value={values.yearLabel}
          >
            <option value="">Select year</option>
            {YEAR_LABELS.map((yearLabel) => (
              <option key={yearLabel} value={yearLabel}>
                {yearLabel}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="profile-graduation-year">
            Graduation year
          </FieldLabel>
          <input
            id="profile-graduation-year"
            onChange={(event) => {
              const nextValue = event.target.value;
              updateField(
                "graduationYear",
                nextValue === "" ? "" : Number(nextValue),
              );
            }}
            type="number"
            value={values.graduationYear}
          />
        </div>
      </div>
    </section>
  );
}

AcademicFields.propTypes = {
  values: PropTypes.shape({
    university: PropTypes.string.isRequired,
    major: PropTypes.string.isRequired,
    yearLabel: PropTypes.string.isRequired,
    graduationYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AcademicFields;
