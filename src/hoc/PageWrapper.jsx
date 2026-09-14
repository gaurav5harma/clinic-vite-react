import React from "react";
import Breadcrumb from "../components/Shared/Breadcrumb/Breadcrumb";

const PageWrapper = (props) => {
  return (
    <div className="page-wrapper" style={{ background: "#fff8ec" }}>
      <div className="container-fluid">
        <Breadcrumb title={props.title} />
      </div>
      <div className="page-body">
        <div className="container-fluid">{props.children}</div>
      </div>
    </div>
  );
};

export default PageWrapper;
