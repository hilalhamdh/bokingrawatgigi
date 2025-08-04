// QRScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length === 0) {
          setError("Tidak ada kamera yang ditemukan");
          return;
        }
        const deviceId = videoInputDevices[0].deviceId;
        codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              onScan(result.getText());
              codeReader.reset();
            }
            if (err && !(err.name === "NotFoundException")) {
              console.error(err);
            }
          }
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal mengakses kamera");
      });

    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default QRScanner;
