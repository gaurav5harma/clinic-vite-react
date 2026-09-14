import React from "react";

import { useNavigate } from "react-router-dom";

const QuickLinks = (props) => {
  const navigate = useNavigate();
  const links = props.data;
  return (
    <div className="row mb-4">
      <div className="col-12 text-right">
        <small
          // className="btn btn-theme px-5"
          style={{
            fontWeight: "bold",
            marginRight: "10px",
          }}
          onClick={() => {}}
        >
          Quick Links :
        </small>
        {props &&
          props.data &&
          props.data.map((el, key) => {
            return (
              <span
                className="hoverable"
                key={key}
                style={{
                  color: "darkred",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
                onClick={() => {
                  navigate(el.route);
                }}
              >
                {el.title}
              </span>
            );
          })}
      </div>
    </div>
  );
};

export default QuickLinks;
