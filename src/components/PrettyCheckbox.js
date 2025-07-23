// PrettyCheckbox.js
import React, { useState } from 'react';
import './PrettyCheckbox.css';

const PrettyCheckbox = ({ id, label, onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
    if (onChange) onChange(e);
  };

  return (
    <div className="pretty p-smooth p-curve p-thick p-icon filterInactive">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
      />
      <div className="state">
        <i className="mdi mdi-check icon"></i>
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
};

export default PrettyCheckbox;