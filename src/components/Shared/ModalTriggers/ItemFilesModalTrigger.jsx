import React, { useState } from "react";
import { FaFolderOpen } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import Colors from "../../../assets/theme/Colors";
import { getAttachmentsService } from "../../../services/HTTPService";

const ItemFilesModalTrigger = (props) => {
  const [showModal, toggleModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
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
              Attachments
            </h2>
            <hr className="mb-3" />
            {attachments &&
              attachments.map((dta, key) => {
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
            {!attachments || attachments.length === 0
              ? "No attachments found"
              : ""}
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
          getAttachmentsService({ item: props.item }).then((res) => {
            if (res.status === 200) {
              setAttachments(res.data);
              toggleModal(true);
            } else {
              toast.error("Something went wrong.");
            }
          });
        }}
      >
        View Attachments
      </button>
    </>
  );
};

export default ItemFilesModalTrigger;
