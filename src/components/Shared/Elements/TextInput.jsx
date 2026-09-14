import React from "react";
import { toast } from "react-toastify";

const TextInput = (props) => {
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
      ) : null}
      <input
        type="text"
        className="form-control"
        placeholder={
          props.placeholder ? props.placeholder : props.label ? props.label : ""
        }
        value={props.value}
        disabled={props.disabled ? props.disabled : false}
        autoFocus={props.autoFocus ? props.autoFocus : false}
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
        onKeyDown={(e) => {
          props.onKeyDown ? props.onKeyDown(e) : "";
        }}
      />
    </>
  );
};

export default TextInput;
