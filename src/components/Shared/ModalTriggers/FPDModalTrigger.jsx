import React, { useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import Colors from "../../../assets/theme/Colors";
import { getFPDsService } from "../../../services/HTTPService";

const FPDModalTrigger = (props) => {
  const [showModal, toggleModal] = useState(false);
  const [data, setData] = useState([]);
  const filesModal = () => {
    return (
      <Modal
        show={showModal}
        onHide={() => toggleModal(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body style={{ padding: "0px 8px" }}>
          <div className="row p-2 ">
            <h2>
              <span style={{ color: Colors.defaultThemeColor }}>
                {props.title}
              </span>{" "}
              FPDs
            </h2>
            <hr className="mb-3" />
            {data &&
              data.map((dta, key) => {
                return (
                  <div className="col-12" key={key}>
                    <a href={dta.url} target="_blank" rel="noopener noreferrer">
                      <FaFolderOpen
                        size={17}
                        style={{
                          color: "#F37121",
                          float: "left",
                          marginRight: "10px",
                          marginTop: "5px",
                        }}
                      />
                      <h3> {dta.file}</h3>
                    </a>
                  </div>
                );
              })}
          </div>
        </Modal.Body>
      </Modal>
    );
  };
  return (
    <>
      {filesModal()}
      <button
        className="btn btn-theme btn-sm "
        onClick={() => {
          getFPDsService({ enquiry: props.enquiry }).then((res) => {
            if (res.status === 200) {
              setAttachments(res.data);
              toggleModal(true);
            } else {
              toast.error("Something went wrong.");
            }
          });
        }}
      >
        View FPDs
      </button>
    </>
  );
};

export default FPDModalTrigger;
