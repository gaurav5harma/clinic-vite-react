import React, { useState, useEffect } from "react";

const Select = (props) => {
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
      <select
        className="form-select"
        value={props.value}
        onChange={(e) => {
          let val = e.target.value;
          props.onChange(val);
        }}
        autoFocus={props.autoFocus ? props.autoFocus : false}
        disabled={props.disabled ? props.disabled : false}
      >
        {props.default ? (
          <option value={props.default.value}>{props.default.name}</option>
        ) : (
          <option value={props.default ? props.default : ""}>
            Select {props.label}
          </option>
        )}
        {props.data &&
          props.data.map((el, key) => {
            return el.value === undefined ? (
              <option value={el} key={key}>
                {el}
              </option>
            ) : (
              <option value={el.value} key={key}>
                {el.name}
              </option>
            );
          })}
      </select>
    </>
  );
};

export default Select;

{
  /* default={{ name: "All Suppliers", value: "all" }} */
}
