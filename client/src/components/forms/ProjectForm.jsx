import { useState } from "react";
import PropTypes from "prop-types";

import {
  EXPERIENCE_LEVELS,
  LOCATION_TYPES,
  PROJECT_CATEGORIES,
  PROJECT_STATUS_OPTIONS,
  PROJECT_STATUSES,
  TECHNOLOGY_OPTIONS,
  WEEKLY_COMMITMENTS,
  PROJECT_DURATIONS,
} from "../../constants/projectOptions.js";
import {
  FieldLabel,
  FieldLegend,
  RequiredFieldsNote,
} from "./FormFieldLabels.jsx";
import styles from "./ProjectForm.module.css";
import ui from "../../styles/ui.module.css";

function createEmptyRole() {
  return {
    title: "",
    description: "",
    requiredSkills: [],
    customSkill: "",
    experienceLevel: "Open to All Levels",
    totalPositions: 1,
  };
}

const initialFormData = {
  title: "",
  tagline: "",
  description: {
    overview: "",
    goals: "",
    currentProgress: "",
    lookingFor: "",
  },
  categories: [],
  customCategory: "",
  technologies: [],
  customTechnology: "",
  roles: [createEmptyRole()],
  experienceLevel: "Open to All Levels",
  locationType: "Remote",
  location: "",
  weeklyCommitment: "",
  duration: "",
  status: "Recruiting",
};

function buildInitialFormData(project) {
  if (!project) {
    return initialFormData;
  }

  const standardTechnologies = project.technologies?.filter((technology) =>
    TECHNOLOGY_OPTIONS.includes(technology),
  );

  const customTechnologies = project.technologies?.filter(
    (technology) => !TECHNOLOGY_OPTIONS.includes(technology),
  );

  return {
    title: project.title ?? "",
    tagline: project.tagline ?? "",
    description: {
      overview: project.description?.overview ?? "",
      goals: project.description?.goals ?? "",
      currentProgress: project.description?.currentProgress ?? "",
      lookingFor: project.description?.lookingFor ?? "",
    },
    categories: project.categories ?? [],
    customCategory: project.customCategories?.[0] ?? "",
    technologies: standardTechnologies ?? [],
    customTechnology: customTechnologies?.[0] ?? "",
    roles:
      project.roles?.length > 0
        ? project.roles.map((role) => ({
            roleId: role.roleId,
            title: role.title ?? "",
            description: role.description ?? "",
            requiredSkills: role.requiredSkills ?? [],
            customSkill: "",
            experienceLevel: role.experienceLevel ?? "Open to All Levels",
            totalPositions: role.totalPositions ?? 1,
          }))
        : [createEmptyRole()],
    experienceLevel: project.experienceLevel ?? "Open to All Levels",
    locationType: project.locationType ?? "Remote",
    location: project.location ?? "",
    weeklyCommitment: project.weeklyCommitment ?? "",
    duration: project.duration ?? "",
    status: project.status ?? "Recruiting",
  };
}

function ProjectForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Project",
  errorTitle = "Project could not be saved",
}) {
  const [formData, setFormData] = useState(() =>
    buildInitialFormData(initialData),
  );
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleDescriptionChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      description: {
        ...currentData.description,
        [name]: value,
      },
    }));
  }

  function handleCheckboxChange(event, fieldName) {
    const { value, checked } = event.target;

    setFormData((currentData) => {
      const currentValues = currentData[fieldName];

      return {
        ...currentData,
        [fieldName]: checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value),
      };
    });
  }

  function handleRoleChange(roleIndex, event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      roles: currentData.roles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              [name]: name === "totalPositions" ? Number(value) : value,
            }
          : role,
      ),
    }));
  }

  function handleRoleSkillChange(roleIndex, event) {
    const { value, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      roles: currentData.roles.map((role, index) => {
        if (index !== roleIndex) {
          return role;
        }

        return {
          ...role,
          requiredSkills: checked
            ? [...role.requiredSkills, value]
            : role.requiredSkills.filter((skill) => skill !== value),
        };
      }),
    }));
  }

  function addRole() {
    setFormData((currentData) => ({
      ...currentData,
      roles: [...currentData.roles, createEmptyRole()],
    }));
  }

  function removeRole(roleIndex) {
    setFormData((currentData) => ({
      ...currentData,
      roles: currentData.roles.filter((_, index) => index !== roleIndex),
    }));
  }
  function addCustomSkill(roleIndex) {
    const role = formData.roles[roleIndex];
    const customSkill = role.customSkill.trim();

    if (
      !customSkill ||
      role.requiredSkills.some(
        (skill) => skill.toLowerCase() === customSkill.toLowerCase(),
      )
    ) {
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      roles: currentData.roles.map((currentRole, index) =>
        index === roleIndex
          ? {
              ...currentRole,
              requiredSkills: [...currentRole.requiredSkills, customSkill],
              customSkill: "",
            }
          : currentRole,
      ),
    }));
  }

  function removeRoleSkill(roleIndex, skillToRemove) {
    setFormData((currentData) => ({
      ...currentData,
      roles: currentData.roles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              requiredSkills: role.requiredSkills.filter(
                (skill) => skill !== skillToRemove,
              ),
            }
          : role,
      ),
    }));
  }
  function buildProjectPayload() {
    const customCategory = formData.customCategory.trim();
    const customTechnology = formData.customTechnology.trim();

    return {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      description: {
        overview: formData.description.overview.trim(),
        goals: formData.description.goals.trim(),
        currentProgress: formData.description.currentProgress.trim(),
        lookingFor: formData.description.lookingFor.trim(),
      },
      categories: formData.categories,
      customCategories:
        formData.categories.includes("Other") && customCategory
          ? [customCategory]
          : [],
      technologies: customTechnology
        ? [...formData.technologies, customTechnology]
        : formData.technologies,
      roles: formData.roles.map((role) => ({
        ...(role.roleId && {
          roleId: role.roleId,
        }),
        title: role.title.trim(),
        description: role.description.trim(),
        requiredSkills: role.requiredSkills,
        experienceLevel: role.experienceLevel,
        totalPositions: Number(role.totalPositions),
      })),
      experienceLevel: formData.experienceLevel,
      locationType: formData.locationType,
      status: formData.status,
      ...(formData.location.trim() && {
        location: formData.location.trim(),
      }),
      ...(formData.weeklyCommitment.trim() && {
        weeklyCommitment: formData.weeklyCommitment.trim(),
      }),
      ...(formData.duration.trim() && {
        duration: formData.duration.trim(),
      }),
    };
  }

  function validateProjectForm() {
    const errors = [];

    if (!formData.title.trim()) {
      errors.push("Project title is required.");
    }

    if (!formData.tagline.trim()) {
      errors.push("Project tagline is required.");
    }

    if (!formData.description.overview.trim()) {
      errors.push("Description overview is required.");
    }

    if (!formData.description.goals.trim()) {
      errors.push("Description goals is required.");
    }

    if (!formData.description.currentProgress.trim()) {
      errors.push("Description currentProgress is required.");
    }

    if (!formData.description.lookingFor.trim()) {
      errors.push("Description lookingFor is required.");
    }

    if (formData.categories.length === 0) {
      errors.push("At least one project category is required.");
    }

    if (
      formData.categories.includes("Other") &&
      !formData.customCategory.trim()
    ) {
      errors.push(
        "At least one custom category is required when Other is selected.",
      );
    }

    if (
      formData.technologies.length === 0 &&
      !formData.customTechnology.trim()
    ) {
      errors.push("At least one skill is required.");
    }

    if (formData.roles.length === 0) {
      errors.push("At least one project role is required.");
    }

    formData.roles.forEach((role, index) => {
      const label = `Role ${index + 1}`;

      if (!role.title.trim()) {
        errors.push(`${label} must have a title.`);
      }

      if (role.requiredSkills.length === 0) {
        errors.push(`${label} must have at least one required skill.`);
      }

      if (!EXPERIENCE_LEVELS.includes(role.experienceLevel)) {
        errors.push(`${label} must have a valid experience level.`);
      }

      const totalPositions = Number(role.totalPositions);

      if (!Number.isInteger(totalPositions) || totalPositions < 1) {
        errors.push(
          `${label} totalPositions must be an integer of at least 1.`,
        );
      }
    });

    if (!LOCATION_TYPES.includes(formData.locationType)) {
      errors.push("A valid location type is required.");
    }

    if (!PROJECT_STATUSES.includes(formData.status)) {
      errors.push("A valid project status is required.");
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setValidationErrors([]);

    const clientErrors = validateProjectForm();

    if (clientErrors.length > 0) {
      setFormError("Please fix the highlighted issues before saving.");
      setValidationErrors(clientErrors);
      return;
    }

    try {
      await onSubmit(buildProjectPayload());
    } catch (error) {
      setFormError(error.message);
      setValidationErrors(error.details ?? []);
    }
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <RequiredFieldsNote />

      <p className={styles.helpText}>
        SideQuest is for collaborative side projects, not traditional job
        postings. Focus on what you are building together and how teammates can
        contribute.
      </p>

      {formError && (
        <div className={styles.errorSummary} role="alert">
          <h2>{errorTitle}</h2>
          <p>{formError}</p>

          {validationErrors.length > 0 && (
            <ul>
              {validationErrors.map((error, index) => (
                <li key={`${error}-${index}`}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <h2>Basic information</h2>
          <p>Introduce the project to potential contributors.</p>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="title" required>
            Project title
          </FieldLabel>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleFieldChange}
            required
          />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="tagline" required>
            Tagline
          </FieldLabel>
          <input
            id="tagline"
            maxLength={150}
            name="tagline"
            type="text"
            value={formData.tagline}
            onChange={handleFieldChange}
            required
          />
          <p className={styles.helpText}>
            A short one sentence pitch that appears on project cards.
          </p>
        </div>
      </section>
      <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <h2>Project description</h2>
          <p>
            Explain what the project is, where it is going, and how collaborators
            can contribute.
          </p>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="overview" required>
            Overview
          </FieldLabel>

          <textarea
            id="overview"
            name="overview"
            rows="5"
            value={formData.description.overview}
            onChange={handleDescriptionChange}
            required
          />

          <p className={styles.helpText}>
            Give collaborators a fuller explanation of what the project does and
            why it matters.
          </p>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="goals" required>
            Goals
          </FieldLabel>
          <textarea
            id="goals"
            name="goals"
            rows="4"
            value={formData.description.goals}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="currentProgress" required>
            Current progress
          </FieldLabel>
          <textarea
            id="currentProgress"
            name="currentProgress"
            rows="4"
            value={formData.description.currentProgress}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="lookingFor" required>
            How can collaborators contribute?
          </FieldLabel>
          <textarea
            id="lookingFor"
            name="lookingFor"
            rows="4"
            value={formData.description.lookingFor}
            onChange={handleDescriptionChange}
            required
          />
        </div>
      </section>
      <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <h2>Categories and skills</h2>
          <p>
            Help collaborators find projects that match what they can offer.
          </p>
        </div>

        <fieldset className={styles.fieldset}>
          <FieldLegend required>Categories</FieldLegend>

          <div className={styles.checkboxGrid}>
            {PROJECT_CATEGORIES.map((category) => (
              <label className={styles.checkboxLabel} key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={formData.categories.includes(category)}
                  onChange={(event) =>
                    handleCheckboxChange(event, "categories")
                  }
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {formData.categories.includes("Other") && (
          <div className={styles.field}>
            <FieldLabel htmlFor="customCategory" required>
              Custom category
            </FieldLabel>
            <input
              id="customCategory"
              name="customCategory"
              type="text"
              value={formData.customCategory}
              onChange={handleFieldChange}
              required
            />
          </div>
        )}

        <fieldset className={styles.fieldset}>
          <FieldLegend required>Skills</FieldLegend>

          <div className={styles.checkboxGrid}>
            {TECHNOLOGY_OPTIONS.map((technology) => (
              <label className={styles.checkboxLabel} key={technology}>
                <input
                  type="checkbox"
                  value={technology}
                  checked={formData.technologies.includes(technology)}
                  onChange={(event) =>
                    handleCheckboxChange(event, "technologies")
                  }
                />
                <span>{technology}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <FieldLabel htmlFor="customTechnology">Additional skill</FieldLabel>
          <input
            id="customTechnology"
            name="customTechnology"
            type="text"
            value={formData.customTechnology}
            onChange={handleFieldChange}
          />
        </div>
      </section>
      <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <h2>Ways to contribute</h2>
          <p>
            Add at least one contribution role to show how teammates can get involved.
          </p>
        </div>

        <div className={styles.roleList}>
          {formData.roles.map((role, roleIndex) => (
            <fieldset className={styles.roleCard} key={`role-${roleIndex}`}>
              <legend>Contribution role {roleIndex + 1}</legend>

              <div className={styles.field}>
                <FieldLabel htmlFor={`role-title-${roleIndex}`} required>
                  Contribution role
                </FieldLabel>
                <input
                  id={`role-title-${roleIndex}`}
                  name="title"
                  type="text"
                  value={role.title}
                  onChange={(event) => handleRoleChange(roleIndex, event)}
                  required
                />
              </div>

              <div className={styles.field}>
                <FieldLabel htmlFor={`role-description-${roleIndex}`}>
                  How will this person contribute?
                </FieldLabel>
                <textarea
                  id={`role-description-${roleIndex}`}
                  name="description"
                  rows="3"
                  value={role.description}
                  onChange={(event) => handleRoleChange(roleIndex, event)}
                />
              </div>

              <div className={styles.twoColumnFields}>
                <div className={styles.field}>
                  <FieldLabel htmlFor={`role-level-${roleIndex}`} required>
                    Experience level
                  </FieldLabel>
                  <select
                    id={`role-level-${roleIndex}`}
                    name="experienceLevel"
                    value={role.experienceLevel}
                    onChange={(event) => handleRoleChange(roleIndex, event)}
                    required
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option value={level} key={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <FieldLabel htmlFor={`role-positions-${roleIndex}`} required>
                    Collaborators needed
                  </FieldLabel>
                  <input
                    id={`role-positions-${roleIndex}`}
                    name="totalPositions"
                    type="number"
                    min="1"
                    value={role.totalPositions}
                    onChange={(event) => handleRoleChange(roleIndex, event)}
                    required
                  />
                </div>
              </div>
              <fieldset className={styles.fieldset}>
                <FieldLegend required>Required skills</FieldLegend>

                <div className={styles.checkboxGrid}>
                  {TECHNOLOGY_OPTIONS.map((skill) => (
                    <label className={styles.checkboxLabel} key={skill}>
                      <input
                        type="checkbox"
                        value={skill}
                        checked={role.requiredSkills.includes(skill)}
                        onChange={(event) =>
                          handleRoleSkillChange(roleIndex, event)
                        }
                      />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={styles.inlineField}>
                <div className={styles.field}>
                  <FieldLabel htmlFor={`custom-skill-${roleIndex}`}>
                    Custom skill
                  </FieldLabel>
                  <input
                    id={`custom-skill-${roleIndex}`}
                    name="customSkill"
                    type="text"
                    value={role.customSkill}
                    onChange={(event) => handleRoleChange(roleIndex, event)}
                  />
                </div>

                <button
                  className={ui.secondaryButton}
                  type="button"
                  onClick={() => addCustomSkill(roleIndex)}
                >
                  Add skill
                </button>
              </div>

              {role.requiredSkills.length > 0 && (
                <div className={styles.selectedSkills}>
                  {role.requiredSkills.map((skill) => (
                    <button
                      className={styles.skillButton}
                      type="button"
                      key={skill}
                      onClick={() => removeRoleSkill(roleIndex, skill)}
                    >
                      {skill} ×
                    </button>
                  ))}
                </div>
              )}

              {formData.roles.length > 1 && (
                <button
                  className={ui.dangerButton}
                  type="button"
                  onClick={() => removeRole(roleIndex)}
                >
                  Remove contribution role
                </button>
              )}
            </fieldset>
          ))}
        </div>

        <button className={ui.secondaryButton} type="button" onClick={addRole}>
          Add another contribution role
        </button>
      </section>
      <section className={styles.formSection}>
        <div className={styles.sectionHeading}>
          <h2>Project logistics</h2>
          <p>Describe how and when the team will work together.</p>
        </div>

        <div className={styles.twoColumnFields}>
          <div className={styles.field}>
            <FieldLabel htmlFor="experienceLevel">
              Overall experience level
            </FieldLabel>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleFieldChange}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option value={level} key={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <FieldLabel htmlFor="locationType" required>
              Location type
            </FieldLabel>
            <select
              id="locationType"
              name="locationType"
              value={formData.locationType}
              onChange={handleFieldChange}
              required
            >
              {LOCATION_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleFieldChange}
            placeholder="Example: Boston, MA"
          />
        </div>

        <div className={styles.twoColumnFields}>
          <div className={styles.field}>
            <FieldLabel htmlFor="weeklyCommitment">
              Weekly commitment
            </FieldLabel>
            <select
              id="weeklyCommitment"
              name="weeklyCommitment"
              value={formData.weeklyCommitment}
              onChange={handleFieldChange}
            >
              <option value="">Select commitment</option>
              {WEEKLY_COMMITMENTS.map((commitment) => (
                <option key={commitment} value={commitment}>
                  {commitment}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <FieldLabel htmlFor="duration">Expected duration</FieldLabel>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleFieldChange}
            >
              <option value="">Select duration</option>
              {PROJECT_DURATIONS.map((projectDuration) => (
                <option key={projectDuration} value={projectDuration}>
                  {projectDuration}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor="status" required>
            Project status
          </FieldLabel>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleFieldChange}
            required
          >
            {PROJECT_STATUS_OPTIONS.map((status) => (
              <option value={status.value} key={status.value}>
                {status.value} — {status.description}
              </option>
            ))}
          </select>
          <p className={styles.helpText}>
            Recruiting means the project is open to new collaborators. In progress
            means the current team is actively building and not seeking additional
            teammates. On hold means the project is temporarily paused.
          </p>
        </div>
      </section>

      <div className={styles.formActions}>
        <button
          className={ui.primaryButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating project..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

ProjectForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    tagline: PropTypes.string,
    description: PropTypes.shape({
      overview: PropTypes.string,
      goals: PropTypes.string,
      currentProgress: PropTypes.string,
      lookingFor: PropTypes.string,
    }),
    categories: PropTypes.arrayOf(PropTypes.string),
    customCategories: PropTypes.arrayOf(PropTypes.string),
    technologies: PropTypes.arrayOf(PropTypes.string),
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        roleId: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        requiredSkills: PropTypes.arrayOf(PropTypes.string),
        experienceLevel: PropTypes.string,
        totalPositions: PropTypes.number,
      }),
    ),
    experienceLevel: PropTypes.string,
    locationType: PropTypes.string,
    location: PropTypes.string,
    weeklyCommitment: PropTypes.string,
    duration: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitLabel: PropTypes.string,
  errorTitle: PropTypes.string,
};

export default ProjectForm;
