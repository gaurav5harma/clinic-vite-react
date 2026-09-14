import React from "react";

const TimeInput = (props) => {
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
        type="time"
        className="form-control"
        placeholder={
          props.placeholder ? props.placeholder : props.label ? props.label : ""
        }
        value={props.value}
        onChange={(e) => {
          let val = e.target.value;
          props.onChange(val);
        }}
        disabled={props.disabled ? props.disabled : false}
      />
    </>
  );
};

export default TimeInput;
