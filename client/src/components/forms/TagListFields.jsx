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
  suggestions = [],
}) {
  const [draft, setDraft] = useState("");

  function addDraftValue() {
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

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addDraftValue();
    }
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
          list={`${id}-suggestions`}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          type="text"
          value={draft}
        />

        <datalist id={`${id}-suggestions`}>
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>

        <button onClick={addDraftValue} type="button">
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
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

export default TagListFields;
