import React from "react";

export default function Wrapper(props) {
  return <div className="page">{props.children}</div>;
}
