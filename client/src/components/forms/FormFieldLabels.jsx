import PropTypes from "prop-types";

import styles from "./FormFieldLabels.module.css";

export function FieldLabel({ htmlFor, required = false, children }) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required ? (
        <span aria-hidden="true" className={styles.requiredMark}>
          {" "}
          *
        </span>
      ) : (
        <span className={styles.optionalMark}> (optional)</span>
      )}
    </label>
  );
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export function FieldLegend({ required = false, children }) {
  return (
    <legend>
      {children}
      {required ? (
        <span aria-hidden="true" className={styles.requiredMark}>
          {" "}
          *
        </span>
      ) : (
        <span className={styles.optionalMark}> (optional)</span>
      )}
    </legend>
  );
}

FieldLegend.propTypes = {
  required: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export function RequiredFieldsNote() {
  return (
    <p className={styles.requiredNote}>
      <span aria-hidden="true" className={styles.requiredMark}>
        *
      </span>{" "}
      Required
    </p>
  );
}
