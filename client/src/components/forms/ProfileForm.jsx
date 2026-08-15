import PropTypes from "prop-types";
import { useState } from "react";

import AcademicFields from "./AcademicFields.jsx";
import AvailabilityFields from "./AvailabilityFields.jsx";
import BasicInfoFields from "./BasicInfoFields.jsx";
import { RequiredFieldsNote } from "./FormFieldLabels.jsx";
import PortfolioFields from "./PortfolioFields.jsx";
import TagListFields from "./TagListFields.jsx";
import styles from "./ProfileForm.module.css";
import ui from "../../styles/ui.module.css";

function buildInitialValues(user) {
  return {
    name: user.name ?? "",
    username: user.username ?? "",
    email: user.email ?? "",
    bio: user.bio ?? "",
    location: user.location ?? "",
    university: user.university ?? "",
    major: user.major ?? "",
    yearLabel: user.yearLabel ?? "",
    graduationYear: user.graduationYear ?? "",
    availability: user.availability ?? "",
    experienceLevel: user.experienceLevel ?? "",
    isRecruiting: Boolean(user.isRecruiting),
    technicalSkills: user.technicalSkills ?? [],
    interests: user.interests ?? [],
    rolePreferences: user.rolePreferences ?? [],
    portfolioLinks: {
      github: user.portfolioLinks?.github ?? "",
      linkedin: user.portfolioLinks?.linkedin ?? "",
      personalSite: user.portfolioLinks?.personalSite ?? "",
    },
  };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateProfileValues(values) {
  const errors = [];

  if (!isNonEmptyString(values.name)) {
    errors.push("Full name is required.");
  }

  if (!isNonEmptyString(values.username)) {
    errors.push("Username is required.");
  }

  if (!isValidEmail(values.email)) {
    errors.push("A valid email is required.");
  }

  return errors;
}

function ProfileForm({ user, onSubmit, isSubmitting }) {
  const [values, setValues] = useState(() => buildInitialValues(user));
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  function updateValues(partialValues) {
    setValues((currentValues) => ({
      ...currentValues,
      ...partialValues,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setValidationErrors([]);

    const clientErrors = validateProfileValues(values);

    if (clientErrors.length > 0) {
      setErrorMessage("Please fix the highlighted issues before saving.");
      setValidationErrors(clientErrors);
      return;
    }

    const payload = {
      name: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      bio: values.bio.trim() || null,
      location: values.location.trim() || null,
      university: values.university.trim() || null,
      major: values.major.trim() || null,
      yearLabel: values.yearLabel || null,
      graduationYear:
        values.graduationYear === "" ? null : values.graduationYear,
      availability: values.availability || null,
      experienceLevel: values.experienceLevel || null,
      isRecruiting: values.isRecruiting,
      technicalSkills: values.technicalSkills,
      interests: values.interests,
      rolePreferences: values.rolePreferences,
      portfolioLinks: {
        github: values.portfolioLinks.github.trim() || null,
        linkedin: values.portfolioLinks.linkedin.trim() || null,
        personalSite: values.portfolioLinks.personalSite.trim() || null,
      },
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setErrorMessage(error.message);
      setValidationErrors(error.details ?? []);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <RequiredFieldsNote />

      {errorMessage ? (
        <div className={styles.errorSummary} role="alert">
          <p className={styles.errorMessage}>{errorMessage}</p>
          {validationErrors.length > 0 ? (
            <ul className={styles.errorList}>
              {validationErrors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <BasicInfoFields
        onChange={(basicInfo) => updateValues(basicInfo)}
        values={values}
      />

      <AcademicFields
        onChange={(academicInfo) => updateValues(academicInfo)}
        values={values}
      />

      <AvailabilityFields
        onChange={(availabilityInfo) => updateValues(availabilityInfo)}
        values={values}
      />

      <section className={styles.formSection}>
        <h2 className={styles.sectionHeading}>Skills & interests</h2>

        <TagListFields
          id="profile-skills"
          label="Skills"
          onChange={(technicalSkills) => updateValues({ technicalSkills })}
          placeholder="Add a skill"
          values={values.technicalSkills}
        />

        <TagListFields
          id="profile-interests"
          label="Interests"
          onChange={(interests) => updateValues({ interests })}
          placeholder="Add an interest"
          values={values.interests}
        />

        <TagListFields
          id="profile-roles"
          label="Preferred roles"
          onChange={(rolePreferences) => updateValues({ rolePreferences })}
          placeholder="Add a preferred role"
          values={values.rolePreferences}
        />
      </section>

      <PortfolioFields
        onChange={(portfolioLinks) => updateValues({ portfolioLinks })}
        values={values.portfolioLinks}
      />

      <div className={styles.actions}>
        <button
          className={ui.primaryButton}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default ProfileForm;
