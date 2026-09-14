// Tagging.jsx
import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Tagging = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [overlay1, setOverlay1] = useState("");
  const [overlay2, setOverlay2] = useState("");
  const canvasRef = useRef();

  // handle image select
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setProcessedImage(null);
  };

  // Remove bg using BodyPix (client-side)
  const handleRemoveBackground = async () => {
    if (!originalImage) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      // dynamic import to avoid bundle bloat
      const tf = await import("@tensorflow/tfjs");
      const bodyPix = await import("@tensorflow-models/body-pix");

      // load model (adjust multiplier/stride for perf/quality)
      const net = await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });

      // create an image element to draw
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = originalImage;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      // create canvas sized to image
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // segmentation options — tweak for speed/quality
      const segmentation = await net.segmentPerson(img, {
        internalResolution: "medium",
        segmentationThreshold: 0.7,
      });

      // create mask where person = opaque and background = transparent
      const mask = bodyPix.toMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 0, g: 0, b: 0, a: 0 }
      );

      // draw original image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Get image data of the original
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const maskData = mask.data; // Uint8ClampedArray RGBA mask

      // Apply mask: where mask alpha == 0 => set alpha to 0 (transparent)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const alpha = maskData[i + 3]; // mask alpha
        if (alpha === 0) {
          imageData.data[i + 3] = 0; // make pixel transparent
        } else {
          // leave as-is (opaque)
          imageData.data[i + 3] = 255;
        }
      }

      // put the result back to canvas
      ctx.putImageData(imageData, 0, 0);

      // produce data URL (PNG keeps transparency)
      const pngUrl = canvas.toDataURL("image/png");
      setProcessedImage(pngUrl);
    } catch (err) {
      console.error("BodyPix error:", err);
      alert("Background removal failed (BodyPix). See console for details.");
    } finally {
      setLoading(false);
    }
  };

  // optional: download final image (PNG)
  const handleDownload = () => {
    const url = processedImage || originalImage;
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.png";
    a.click();
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4">Client-side Background Removal (BodyPix)</h2>

      <div className="mb-3 w-50 mx-auto">
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          placeholder="Overlay text 1"
          className="form-control mb-2"
          value={overlay1}
          onChange={(e) => setOverlay1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Overlay text 2"
          className="form-control mb-2"
          value={overlay2}
          onChange={(e) => setOverlay2(e.target.value)}
        />
        <button
          className="btn btn-primary me-2"
          onClick={handleRemoveBackground}
          disabled={loading}
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>
        <button
          className="btn btn-success"
          onClick={handleDownload}
          disabled={!processedImage && !originalImage}
        >
          Download
        </button>
      </div>

      <div className="mt-4">
        {originalImage && !processedImage && (
          <div className="d-inline-block mx-3">
            <h6>Original</h6>
            <img
              src={originalImage}
              alt="original"
              style={{ maxWidth: 300 }}
              className="img-fluid rounded shadow"
            />
          </div>
        )}

        {processedImage && (
          <div className="position-relative d-inline-block mx-3">
            <h6>Result (background removed)</h6>
            <img
              src={processedImage}
              alt="processed"
              style={{ maxWidth: 400 }}
              className="img-fluid rounded shadow bg-light"
            />

            {/* overlay texts with white outer stroke */}
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <div
                style={{
                  color: "black",
                  WebkitTextStroke: "2px white",
                  fontWeight: "700",
                  fontSize: 20,
                }}
              >
                {overlay1}
              </div>
              <div
                style={{
                  marginTop: 8,
                  color: "black",
                  WebkitTextStroke: "2px white",
                  fontWeight: "700",
                  fontSize: 20,
                }}
              >
                {overlay2}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* hidden canvas used for processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Tagging;
