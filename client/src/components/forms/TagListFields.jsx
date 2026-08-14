import PropTypes from "prop-types";
import { useState } from "react";

import { FieldLabel } from "./FormFieldLabels.jsx";
import styles from "./ProfileForm.module.css";

function TagListFields({
  id,
  label,
  values,
  onChange,
  placeholder,
  required = false,
}) {
  const [draft, setDraft] = useState("");

  function handleAdd(event) {
    event.preventDefault();

    const nextValue = draft.trim();

    if (!nextValue) {
      return;
    }

    if (
      values.some((value) => value.toLowerCase() === nextValue.toLowerCase())
    ) {
      setDraft("");
      return;
    }

    onChange([...values, nextValue]);
    setDraft("");
  }

  function handleRemove(valueToRemove) {
    onChange(values.filter((value) => value !== valueToRemove));
  }

  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>

      {values.length > 0 ? (
        <ul className={styles.tagRow}>
          {values.map((value) => (
            <li className={styles.tag} key={value}>
              <span>{value}</span>
              <button
                aria-label={`Remove ${value}`}
                onClick={() => handleRemove(value)}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.addRow}>
        <input
          id={id}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          type="text"
          value={draft}
        />
        <button onClick={handleAdd} type="button">
          Add
        </button>
      </div>
    </div>
  );
}

TagListFields.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

export default TagListFields;
