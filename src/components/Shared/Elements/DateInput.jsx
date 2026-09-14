import React from "react";
import { toast } from "react-toastify";

const DateInput = (props) => {
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
        type="date"
        className="form-control"
        placeholder={
          props.placeholder ? props.placeholder : props.label ? props.label : ""
        }
        value={props.value}
        min={props.minDate}
        max={props.maxDate}
        onChange={(e) => {
          // let val = e.target.value;
          // props.onChange(val);

          const val = e.target.value;

          // empty allow (optional)
          if (!val) {
            props.onChange(val);
            return;
          }

          const selected = new Date(val);
          const min = props.minDate ? new Date(props.minDate) : null;
          const max = props.maxDate ? new Date(props.maxDate) : null;

          if (min && selected < min) {
            toast.warning(`Date cannot be less than ${props.minDate}`);
            return;
          }

          if (max && selected > max) {
            toast.warning(`Date cannot be greater that ${props.maxDate}`);
            return;
          }

          // ✅ valid date
          props.onChange(val);
        }}
        disabled={props.disabled ? props.disabled : false}
        readOnly={props.readOnly ? props.readOnly : false}
        onKeyDown={(e) =>
          props.keyDisable === true ? e.preventDefault() : null
        }
        onPaste={(e) => (props.keyDisable === true ? e.preventDefault() : null)}
        onDrop={(e) => (props.keyDisable === true ? e.preventDefault() : null)}
        // inputMode="none"
      />
    </>
  );
};

export default DateInput;
