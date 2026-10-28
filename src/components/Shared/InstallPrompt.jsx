import React, { useEffect, useState } from "react";
import { FaDownload, FaTimes } from "react-icons/fa";

const isAppInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isAppInstalled()) return;

    setShowPrompt(true);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.55)", zIndex: 1055 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-app-title"
    >
      <div className="card shadow" style={{ width: "min(420px, calc(100vw - 32px))" }}>
        <div className="card-body p-4">
          <button
            type="button"
            className="btn-close float-end"
            aria-label="Close"
            onClick={() => setShowPrompt(false)}
          />
          <h5 id="install-app-title" className="mb-3">Install Shri Gurunanak Hospital</h5>
          <p className="mb-3">Install this app for quicker access and an app-like experience.</p>
          {isIos && !deferredPrompt ? (
            <p className="mb-0">
              In Safari, tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.
            </p>
          ) : (
            <button
              type="button"
              className="btn btn-theme w-100"
              onClick={installApp}
              disabled={!deferredPrompt}
            >
              <FaDownload className="me-2" />
              {deferredPrompt ? "Install App" : "Waiting for browser installation support..."}
            </button>
          )}
          <button
            type="button"
            className="btn btn-light w-100 mt-2"
            onClick={() => setShowPrompt(false)}
          >
            <FaTimes className="me-2" />
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
