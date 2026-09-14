import React from "react";

const Breadcrumb = (props) => {
  return (
    <div className="page-header d-print-none">
      <div className="row g-2 align-items-center">
        <div className="col">
          {/* <div className="page-pretitle">{props.subtitle}</div> */}
          <h2 className="page-title">{props.title}</h2>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
