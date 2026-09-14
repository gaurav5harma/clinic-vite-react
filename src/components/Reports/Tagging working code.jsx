import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";

const Tagging = () => {
  const { ref: key } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef();

  const current = new Date();
  const date = current.toISOString().substring(0, 10);

  const [overlayText1, setOverlayText1] = useState("");
  const [overlayText2, setOverlayText2] = useState("");
  const [image, setImage] = useState(null);
  const [payload] = useState({
    date: date,
    latLng: "24.35123, 78.123456",
  });

  // handle upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // convert the div to JPG and download
  const handleDownload = async () => {
    if (!componentRef.current) return;

    const canvas = await html2canvas(componentRef.current, {
      useCORS: true,
      scale: 3, // improve quality
    });

    let quality = 0.8; // initial compression quality
    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    // Ensure the file size is between 100–200 KB
    while (
      dataUrl.length / 1024 > 200 &&
      quality > 0.3 // reduce quality until in range
    ) {
      quality -= 0.05;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    // Create download link
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "tagged_image.jpg";
    link.click();
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="mb-4 fw-bold text-dark">Tagging</h2>

      {/* First Textbox */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Enter first text..."
          value={overlayText1}
          onChange={(e) => setOverlayText1(e.target.value)}
        />
      </div>

      {/* Second Textbox */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control w-50 mx-auto"
          placeholder="Enter second text..."
          value={overlayText2}
          onChange={(e) => setOverlayText2(e.target.value)}
        />
      </div>

      {/* Drop Zone */}
      <div
        className="border border-secondary border-2 rounded-3 p-5 mx-auto w-50 bg-light"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="fileInput"
          style={{ display: "none" }}
        />
        <label htmlFor="fileInput" className="text-muted">
          Drag & drop an image here, or{" "}
          <span className="text-primary fw-semibold">browse</span> to upload
        </label>
      </div>

      {/* Image preview with overlay */}
      {image && (
        <>
          <div
            className="position-relative d-inline-block mt-4 bg-white"
            ref={componentRef}
          >
            <img
              src={image}
              alt="Uploaded Preview"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "400px" }}
            />

            {/* Floating text 1 */}
            <span
              className="position-absolute fw-bold"
              style={{
                top: "10px",
                left: "10px",
                color: "black",
                fontSize: "20px",
                WebkitTextStroke: "2px white",
                paintOrder: "stroke fill",
              }}
            >
              {overlayText1 || ""}
            </span>

            {/* Floating text 2 */}
            <span
              className="position-absolute fw-bold"
              style={{
                top: "45px",
                left: "10px",
                color: "black",
                fontSize: "20px",
                WebkitTextStroke: "2px white",
                paintOrder: "stroke fill",
              }}
            >
              {overlayText2 || ""}
            </span>

            {/* Metadata text */}
            <div
              className="position-absolute text-white bg-dark bg-opacity-75 px-2 py-1 rounded"
              style={{
                bottom: "10px",
                left: "10px",
                fontSize: "12px",
              }}
            >
              {payload.date} | {payload.latLng}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-4">
            <button className="btn btn-success" onClick={handleDownload}>
              Download as JPG
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Tagging;
