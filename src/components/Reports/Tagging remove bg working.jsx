import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Tagging = () => {
  const [original, setOriginal] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // 👇 put your Remove.bg API key here
  const API_KEY = "fZ2vBzEaHd6PJXr4r815FzA5";

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOriginal(file);
    setProcessed(null);
    setStatus("");
  };

  const handleRemoveBg = async () => {
    if (!original) return alert("Please upload an image first.");
    if (!API_KEY || API_KEY === "YOUR_REMOVE_BG_API_KEY")
      return alert("Please insert your Remove.bg API key in the code.");

    setLoading(true);
    setStatus("Uploading to Remove.bg...");

    try {
      const formData = new FormData();
      formData.append("image_file", original);
      formData.append("size", "auto");

      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": API_KEY,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setProcessed(url);
      setStatus("✅ Background removed successfully!");
    } catch (err) {
      console.error("Background removal error:", err);
      setStatus("❌ Background removal failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!processed) return;
    const a = document.createElement("a");
    a.href = processed;
    a.download = "bg_removed.png";
    a.click();
  };

  return (
    <div className="container text-center py-5">
      <h3 className="mb-4">🪄 AI Background Remover (Remove.bg API)</h3>

      <div className="mb-4 w-50 mx-auto">
        <input
          type="file"
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFile}
        />
        <button
          className="btn btn-primary me-2"
          onClick={handleRemoveBg}
          disabled={loading || !original}
        >
          {loading ? "Processing..." : "Remove Background"}
        </button>
        <button
          className="btn btn-success"
          onClick={handleDownload}
          disabled={!processed}
        >
          Download Result
        </button>
      </div>

      <p className="text-muted">{status}</p>

      <div className="d-flex justify-content-center gap-4 flex-wrap">
        {original && (
          <div>
            <h6>Original</h6>
            <img
              src={URL.createObjectURL(original)}
              alt="Original"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "320px" }}
            />
          </div>
        )}
        {processed && (
          <div>
            <h6>Processed</h6>
            <img
              src={processed}
              alt="Processed"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "320px", background: "#f0f0f0" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tagging;
