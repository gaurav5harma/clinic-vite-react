// Tagging.jsx — remove.bg API version
import React, { useState, useRef, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
//
const REMOVE_BG_API_KEY = "fZ2vBzEaHd6PJXr4r815FzA5";

const Tagging = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [subjectImage, setSubjectImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);

  const [overlay1, setOverlay1] = useState("");
  const [overlay2, setOverlay2] = useState("");

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [subjectState, setSubjectState] = useState({
    x: 20,
    y: 20,
    width: 200,
    height: 200,
  });

  const draggingRef = useRef(false);
  const resizingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0, sx: 0, sy: 0, sw: 0, sh: 0 });

  // -----------------------------
  //  Handle Image Upload
  // -----------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setOriginalImage(url);
    setSubjectImage(null);
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setBgImage(url);
  };

  // -----------------------------------------
  //  REMOVE BACKGROUND USING remove.bg API
  // -----------------------------------------
  const handleRemoveBackground = async () => {
    if (!originalImage) {
      alert("Upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const blob = await fetch(originalImage).then((r) => r.blob());
      const formData = new FormData();
      formData.append("image_file", blob, "input.png");
      formData.append("size", "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("remove.bg API error:", errText);
        alert("remove.bg error — see console");
        setLoading(false);
        return;
      }

      const outputBlob = await res.blob();
      const outputURL = URL.createObjectURL(outputBlob);

      // Load size of transparent image into canvas to calculate scale
      const img = new Image();
      img.src = outputURL;

      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });

      const maxInitial = 300;
      const scale = Math.min(
        maxInitial / img.width,
        maxInitial / img.height,
        1
      );

      const initW = Math.round(img.width * scale);
      const initH = Math.round(img.height * scale);

      setSubjectImage(outputURL);

      // set initial position inside container
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
    } catch (e) {
      console.error("Background removal error:", e);
      alert("Background removal failed.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  //  POINTER EVENTS (dragging & resizing)
  // -------------------------------------
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

        // clamp boundaries
        nx = Math.max(0, Math.min(nx, rect.width - subjectState.width));
        ny = Math.max(0, Math.min(ny, rect.height - subjectState.height));

        setSubjectState((s) => ({ ...s, x: nx, y: ny }));
      }

      if (resizingRef.current) {
        const start = pointerStartRef.current;
        const dx = px - start.x;
        const dy = py - start.y;

        let newW = Math.max(40, start.sw + dx);
        let newH = Math.max(40, start.sh + dy);

        newW = Math.min(newW, rect.width - start.sx);
        newH = Math.min(newH, rect.height - start.sy);

        setSubjectState((s) => ({ ...s, width: newW, height: newH }));
      }
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      resizingRef.current = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [subjectState.width, subjectState.height]);

  const onSubjectPointerDown = (e) => {
    draggingRef.current = true;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      sx: subjectState.x,
      sy: subjectState.y,
      sw: subjectState.width,
      sh: subjectState.height,
    };
    e.preventDefault();
  };

  const onResizePointerDown = (e) => {
    resizingRef.current = true;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      sx: subjectState.x,
      sy: subjectState.y,
      sw: subjectState.width,
      sh: subjectState.height,
    };
    e.preventDefault();
  };

  // ---------------------------------------
  //  COMPOSE FINAL IMAGE & DOWNLOAD (PNG)
  // ---------------------------------------
  const handleApplyAndDownload = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");

    if (bgImage) {
      const bg = new Image();
      bg.src = bgImage;
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        drawFinal(ctx);
      };
      bg.onerror = () => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawFinal(ctx);
      };
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawFinal(ctx);
    }
  };

  const drawFinal = (ctx) => {
    if (subjectImage) {
      const img = new Image();
      img.src = subjectImage;
      img.onload = () => {
        ctx.drawImage(
          img,
          subjectState.x,
          subjectState.y,
          subjectState.width,
          subjectState.height
        );

        drawText(ctx);
      };
    } else {
      drawText(ctx);
    }
  };

  const drawText = (ctx) => {
    ctx.font = "bold 28px Arial";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";

    ctx.strokeText(overlay1, 10, 6);
    ctx.fillText(overlay1, 10, 6);

    ctx.strokeText(overlay2, 10, 40);
    ctx.fillText(overlay2, 10, 40);

    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/png");
    link.download = "composited.png";
    link.click();
  };

  // -------------------------------------------
  //  JSX UI
  // -------------------------------------------
  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">
        Background Remove (remove.bg) + Drag & Resize
      </h3>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Upload Foreground Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
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
          </div>

          <div className="mb-3">
            <label className="form-label">
              Upload Background Image (optional)
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleBgImageUpload}
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control mb-2"
              placeholder="Overlay text 1"
              value={overlay1}
              onChange={(e) => setOverlay1(e.target.value)}
            />
            <input
              className="form-control"
              placeholder="Overlay text 2"
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
            {subjectImage && (
              <div
                onPointerDown={onSubjectPointerDown}
                style={{
                  position: "absolute",
                  left: subjectState.x,
                  top: subjectState.y,
                  width: subjectState.width,
                  height: subjectState.height,
                  touchAction: "none",
                  userSelect: "none",
                }}
              >
                <img
                  src={subjectImage}
                  alt="subject"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                />

                {/* Resize Handle */}
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
                  }}
                />
              </div>
            )}

            {/* Overlay texts */}
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
                  marginTop: 8,
                  color: "black",
                  WebkitTextStroke: "2px white",
                  fontWeight: 700,
                  fontSize: 20,
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
