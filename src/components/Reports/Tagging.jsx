// Tagging.jsx — remove.bg API version
import React, { useState, useRef, useEffect } from "react";
import { getTaggingDataService } from "../../services/HTTPService";
// import "bootstrap/dist/css/bootstrap.min.css";
//
const REMOVE_BG_API_KEY = "fZ2vBzEaHd6PJXr4r815FzA5";

const Tagging = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [subjectImage, setSubjectImage] = useState(null);

  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);
  const [taggingData, setTaggingData] = useState(null);

  const [overlay1, setOverlay1] = useState("");
  const [overlay2, setOverlay2] = useState("");
  const [estimatedSize, setEstimatedSize] = useState(null);

  const getDetails = () => {
    getTaggingDataService().then((res) => {
      if (res.status === 200) {
        if (res.data.status === "success") {
          setOverlay1(res.data.valueA);
          setOverlay2(res.data.valueB);
        } else {
          toast.error(res.data.msg);
        }
      } else {
        toast.error("Something went wrong.");
      }
    });
  };

  const [imagSize, setImageSize] = useState({
    ratioWidth: 4,
    ratioHeight: 3,
    multiplier: 140,
    min: 100,
    max: 250,
    unit: "px",
  });
  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    estimateFinalImageSize();
  }, [imagSize.multiplier, overlay1, overlay2, bgImage, bgColor]);

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
  const [textSize, setTxtSize] = useState({
    size: 16,
    unit: "px",
  });

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
    drawText(ctx);
  };

  const estimateFinalImageSize = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // offscreen canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = rect.width;
    tempCanvas.height = rect.height;

    const ctx = tempCanvas.getContext("2d");

    // background
    if (bgImage) {
      const bg = new Image();
      bg.src = bgImage;
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, tempCanvas.width, tempCanvas.height);
        // drawText(ctx);
        calculateSize(tempCanvas);
      };
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // drawText(ctx);
      calculateSize(tempCanvas);
    }
  };

  const calculateSize = (canvas) => {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

    const bytes = Math.round((dataUrl.length * 3) / 4);
    const kb = (bytes / 1024).toFixed(2);
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    const maxKB = Number(kb) + Number((kb * 5) / 100);

    setEstimatedSize({ kb: kb, maxKB: maxKB.toFixed(2) });
  };

  const drawText = (ctx) => {
    // console.log(ctx);
    ctx.font = "500 16px Calibri, sans-serif";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.textBaseline = "top";

    ctx.strokeText(overlay1, 10, 11);
    ctx.fillText(overlay1, 10, 11);

    ctx.strokeText(overlay2, 10, 30);
    ctx.fillText(overlay2, 10, 30);

    const link = document.createElement("a");
    link.href = canvasRef.current.toDataURL("image/jpeg");
    link.download = "composited.jpg";
    link.click();
  };

  // -------------------------------------------
  //  JSX UI
  // -------------------------------------------

  const getImageSize = (val) => {
    let v = "";
    if (val === "width") {
      v = imagSize.ratioWidth * imagSize.multiplier;
      v += imagSize.unit;
      console.log(v);
    }

    if (val === "height") {
      v = imagSize.ratioHeight * imagSize.multiplier;
      v += imagSize.unit;
      console.log(v);
    }
    return v;
  };
  return (
    <div className="container py-5" style={{ overflowX: "auto" }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Upload Image</label>
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
            <button className="btn btn-theme me-2" onClick={getDetails}>
              Regenerate
            </button>
            <button className="btn btn-theme" onClick={handleApplyAndDownload}>
              Download
            </button>
          </div>

          <div>
            {estimatedSize && (
              <div className="alert alert-info mt-2">
                <input
                  type="range"
                  class="form-range"
                  value={imagSize.multiplier}
                  min={imagSize.min}
                  max={imagSize.max}
                  step={10}
                  onChange={(val) => {
                    let multiplier = val.target.value;
                    setImageSize({ ...imagSize, multiplier: multiplier });
                  }}
                />
                Image Size:{" "}
                <b>
                  {imagSize.ratioWidth * imagSize.multiplier} x{" "}
                  {imagSize.ratioHeight * imagSize.multiplier} {imagSize.unit}
                </b>{" "}
                | <b>{estimatedSize.kb}KB ± 10%</b>
              </div>
            )}
          </div>
          <div
            ref={containerRef}
            className="mx-auto position-relative border rounded"
            style={{
              width: getImageSize("width"),
              height: getImageSize("height"),
              backgroundColor: bgImage ? undefined : bgColor,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
            }}
          >
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
                  WebkitTextStroke: ".8px white",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {overlay1}
              </div>
              <div
                style={{
                  marginTop: 0,
                  color: "black",
                  WebkitTextStroke: ".8px white",
                  fontWeight: 700,
                  fontSize: 16,
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
