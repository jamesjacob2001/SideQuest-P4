import PropTypes from "prop-types";

import {
  AVAILABILITY_OPTIONS,
  USER_EXPERIENCE_LEVELS,
} from "../../constants/userOptions.js";
import { FieldLabel } from "./FormFieldLabels.jsx";
import styles from "./ProfileForm.module.css";

function AvailabilityFields({ values, onChange }) {
  function updateField(field, value) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionHeading}>Availability</h2>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <FieldLabel htmlFor="profile-availability">
            Weekly availability
          </FieldLabel>
          <select
            id="profile-availability"
            onChange={(event) =>
              updateField("availability", event.target.value)
            }
            value={values.availability}
          >
            <option value="">Select availability</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="profile-experience">Experience level</FieldLabel>
          <select
            id="profile-experience"
            onChange={(event) =>
              updateField("experienceLevel", event.target.value)
            }
            value={values.experienceLevel}
          >
            <option value="">Select level</option>
            {USER_EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className={styles.checkboxField}>
        <input
          checked={values.isRecruiting}
          onChange={(event) =>
            updateField("isRecruiting", event.target.checked)
          }
          type="checkbox"
        />
        Open to collaborate on projects{" "}
        <span className={styles.optionalInline}>(optional)</span>
      </label>
    </section>
  );
}

AvailabilityFields.propTypes = {
  values: PropTypes.shape({
    availability: PropTypes.string.isRequired,
    experienceLevel: PropTypes.string.isRequired,
    isRecruiting: PropTypes.bool.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AvailabilityFields;
