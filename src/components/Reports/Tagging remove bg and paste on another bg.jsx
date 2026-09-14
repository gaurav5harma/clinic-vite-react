// Tagging.jsx
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Tagging = () => {
  // images
  const [originalImage, setOriginalImage] = useState(null);
  const [subjectImage, setSubjectImage] = useState(null); // transparent PNG subject
  const [loading, setLoading] = useState(false);

  // background replacement
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);

  // overlay text
  const [overlay1, setOverlay1] = useState("");
  const [overlay2, setOverlay2] = useState("");

  // references
  const containerRef = useRef(null); // visual container where subject is dragged/resized
  const canvasRef = useRef(null); // hidden canvas for final composition

  // subject position & size (relative to container)
  const [subjectState, setSubjectState] = useState({
    x: 20, // px
    y: 20,
    width: 200,
    height: 200,
  });

  // dragging/resizing flags
  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, sx: 0, sy: 0, sw: 0, sh: 0 });

  // load image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setSubjectImage(null); // reset previous subject
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  // BodyPix background removal -> produce transparent subject PNG URL
  const handleRemoveBackground = async () => {
    if (!originalImage) {
      alert("Upload an image first.");
      return;
    }
    setLoading(true);
    try {
      const bodyPix = await import("@tensorflow-models/body-pix");
      await import("@tensorflow/tfjs"); // ensure tf loaded

      const net = await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      });

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = originalImage;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      // create temporary canvas same size as image
      const tmp = document.createElement("canvas");
      tmp.width = img.width;
      tmp.height = img.height;
      const tctx = tmp.getContext("2d");
      tctx.drawImage(img, 0, 0);

      const segmentation = await net.segmentPerson(img, {
        internalResolution: "medium",
        segmentationThreshold: 0.7,
      });

      const mask = bodyPix.toMask(
        segmentation,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 0, g: 0, b: 0, a: 0 }
      );

      // apply mask: set alpha from mask
      const imageData = tctx.getImageData(0, 0, tmp.width, tmp.height);
      const maskData = mask.data;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const alpha = maskData[i + 3]; // mask alpha
        imageData.data[i + 3] = alpha; // subject alpha
      }
      tctx.putImageData(imageData, 0, 0);

      // create scaled subject image initial size
      const maxInitial = 300;
      let initW = tmp.width;
      let initH = tmp.height;
      const scaleFactor = Math.min(1, maxInitial / Math.max(initW, initH));
      initW = Math.round(initW * scaleFactor);
      initH = Math.round(initH * scaleFactor);

      // create subject canvas to scale down (for faster drag/resize)
      const subjectCanvas = document.createElement("canvas");
      subjectCanvas.width = initW;
      subjectCanvas.height = initH;
      subjectCanvas.getContext("2d").drawImage(tmp, 0, 0, initW, initH);

      const pngUrl = subjectCanvas.toDataURL("image/png");
      setSubjectImage(pngUrl);

      // set initial position & size in container coordinates once container width known
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const startW = Math.min(initW, rect.width * 0.6);
        const startH = (initH / initW) * startW;
        setSubjectState({
          x: Math.round(rect.width * 0.1),
          y: Math.round(rect.height * 0.1),
          width: Math.round(startW),
          height: Math.round(startH),
        });
      });
    } catch (err) {
      console.error("BodyPix error:", err);
      alert("Background removal failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  // pointer handlers for drag + resize
  useEffect(() => {
    const onPointerMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX;
      const py = e.clientY;

      if (draggingRef.current) {
        const start = pointerStartRef.current;
        const dx = px - start.x;
        const dy = py - start.y;
        let nx = start.sx + dx;
        let ny = start.sy + dy;

        // clamp within container
        nx = Math.max(0, Math.min(nx, rect.width - subjectState.width));
        ny = Math.max(0, Math.min(ny, rect.height - subjectState.height));

        setSubjectState((s) => ({
          ...s,
          x: Math.round(nx),
          y: Math.round(ny),
        }));
      } else if (resizingRef.current) {
        const start = pointerStartRef.current;
        const dx = px - start.x;
        const dy = py - start.y;

        let newW = Math.max(40, Math.round(start.sw + dx));
        let newH = Math.max(40, Math.round(start.sh + dy));

        // prevent overflow beyond container
        newW = Math.min(newW, rect.width - start.sx);
        newH = Math.min(newH, rect.height - start.sy);

        setSubjectState((s) => ({ ...s, width: newW, height: newH }));
      }
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      resizingRef.current = false;
      // release pointer capture state
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [subjectState.width, subjectState.height]);

  // start dragging
  const onSubjectPointerDown = (e) => {
    if (e.button && e.button !== 0) return; // only left click
    draggingRef.current = true;
    const start = {
      x: e.clientX,
      y: e.clientY,
      sx: subjectState.x,
      sy: subjectState.y,
      sw: subjectState.width,
      sh: subjectState.height,
    };
    pointerStartRef.current = start;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  // start resizing (bottom-right handle)
  const onResizePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    resizingRef.current = true;
    const start = {
      x: e.clientX,
      y: e.clientY,
      sx: subjectState.x,
      sy: subjectState.y,
      sw: subjectState.width,
      sh: subjectState.height,
    };
    pointerStartRef.current = start;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  // composite and download final image (PNG)
  const handleApplyAndDownload = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // set canvas size same as container's logical pixels
    const rect = container.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // draw background: color or image
    if (bgImage) {
      const bg = new Image();
      bg.crossOrigin = "anonymous";
      bg.src = bgImage;
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, width, height);
        drawSubjectAndText(ctx, width, height);
      };
      bg.onerror = () => {
        // fallback to solid color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        drawSubjectAndText(ctx, width, height);
      };
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      drawSubjectAndText(ctx, width, height);
    }
  };

  // helper to draw subject and overlay text then trigger download
  const drawSubjectAndText = (ctx, width, height) => {
    if (subjectImage) {
      const subj = new Image();
      subj.crossOrigin = "anonymous";
      subj.src = subjectImage;
      subj.onload = () => {
        // draw subject at subjectState coords/sizes
        ctx.drawImage(
          subj,
          subjectState.x,
          subjectState.y,
          subjectState.width,
          subjectState.height
        );

        // draw overlay text (white stroke)
        ctx.font = "bold 28px Arial";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        ctx.fillStyle = "black";
        ctx.textBaseline = "top";
        const paddingTop = 6;
        ctx.strokeText(overlay1, 10, paddingTop);
        ctx.fillText(overlay1, 10, paddingTop);
        ctx.strokeText(overlay2, 10, paddingTop + 34);
        ctx.fillText(overlay2, 10, paddingTop + 34);

        // download PNG
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "composited.png";
        a.click();
      };
      subj.onerror = () => {
        alert("Failed to load subject for compositing.");
      };
    } else {
      // no subject: just draw text over bg
      ctx.font = "bold 28px Arial";
      ctx.lineWidth = 4;
      ctx.strokeStyle = "white";
      ctx.fillStyle = "black";
      ctx.textBaseline = "top";
      ctx.strokeText(overlay1, 10, 6);
      ctx.fillText(overlay1, 10, 6);
      ctx.strokeText(overlay2, 10, 40);
      ctx.fillText(overlay2, 10, 40);

      const dataUrl = canvasRef.current.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "composited.png";
      a.click();
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">
        Background Remove — Drag & Resize Subject
      </h3>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Upload Foreground Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageUpload}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Background Color</label>
            <input
              type="color"
              className="form-control form-control-color w-auto"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
            <div className="form-text">
              Or upload a background image below (it will fill the container)
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Upload Background Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleBgImageUpload}
            />
          </div>

          <div className="mb-3">
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
              className="form-control"
              value={overlay2}
              onChange={(e) => setOverlay2(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={handleRemoveBackground}
              disabled={loading}
            >
              {loading ? "Removing..." : "Remove Background"}
            </button>
            <button
              className="btn btn-success"
              onClick={handleApplyAndDownload}
              disabled={!subjectImage && !originalImage}
            >
              Apply & Download
            </button>
          </div>

          <div className="mb-3">
            <small className="text-muted">
              Drag the subject to move it. Use bottom-right handle to resize.
            </small>
          </div>

          {/* visual container */}
          <div
            ref={containerRef}
            className="mx-auto position-relative border rounded"
            style={{
              width: "720px",
              height: "480px",
              backgroundColor: bgImage ? undefined : bgColor,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
            }}
          >
            {/* subject image layer */}
            {subjectImage && (
              <div
                style={{
                  position: "absolute",
                  left: subjectState.x,
                  top: subjectState.y,
                  width: subjectState.width,
                  height: subjectState.height,
                  touchAction: "none",
                  userSelect: "none",
                }}
                onPointerDown={onSubjectPointerDown}
              >
                <img
                  src={subjectImage}
                  alt="subject"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
                {/* resize handle */}
                <div
                  onPointerDown={onResizePointerDown}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 18,
                    height: 18,
                    background: "white",
                    border: "2px solid #666",
                    borderRadius: 3,
                    transform: "translate(50%, 50%)",
                    cursor: "nwse-resize",
                    touchAction: "none",
                  }}
                />
              </div>
            )}

            {/* overlay texts rendered visually (not part of final composed subject layer) */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  color: "black",
                  WebkitTextStroke: "2px white",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {overlay1}
              </div>
              <div
                style={{
                  color: "black",
                  WebkitTextStroke: "2px white",
                  fontWeight: 700,
                  fontSize: 20,
                  marginTop: 8,
                }}
              >
                {overlay2}
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </div>
    </div>
  );
};

export default Tagging;
