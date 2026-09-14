import React from "react";

const InputMeta = (props) => {
  return (
    <span style={{ float: "right", color: props.color, fontWeight: "bold" }}>
      <small>{props.data}</small>
    </span>
  );
};

export default InputMeta;
