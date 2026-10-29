import React from "react";

const NumInput = (props) => {
  const validateLength = (val) => {
    if (props.maxLength && Number(props.maxLength) > 0) {
      if (val.length <= Number(props.maxLength)) {
        return true;
      } else return false;
    } else return true;
  };
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
        type="number"
        className="form-control"
        onWheel={(e) => e.target.blur()}
        placeholder={
          props.placeholder ? props.placeholder : props.label ? props.label : ""
        }
        value={props.value}
        disabled={props.disabled ? props.disabled : false}
        readOnly={props.readOnly ? props.readOnly : false}
        onChange={(e) => {
          let val = e.target.value;
          if (props.pattern) {
            if (props.pattern(val) === true) {
              if (validateLength(val) === true) {
                props.onChange(val);
              }
            } else {
              toast.warning("Invalid Character");
            }
          } else {
            if (validateLength(val) === true) {
              props.onChange(val);
            }
          }
        }}
      />
    </>
  );
};

export default NumInput;
