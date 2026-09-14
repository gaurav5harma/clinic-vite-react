import React from "react";

const Checkbox = (props) => {
  return (
    <>
      {props.label ? (
        <label className="form-label">
          {props.label}{" "}
          {props.required && props.required === true ? (
            <span style={{ color: "darkred" }}> *</span>
          ) : null}
        </label>
      ) : null}{" "}
      <input
        type="checkbox"
        className="form-check-input"
        checked={props.checked ? props.checked : false}
        onChange={(e) => {
          let val = e.target.checked;
          props.onChange(val);
        }}
      />
    </>
  );
};

export default Checkbox;
