import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerId = "html5-qrcode-scanner";
  let html5QrCode = null;

  useEffect(() => {
    html5QrCode = new Html5Qrcode(scannerId);

    const startScanner = async () => {
      try {
        setIsScanning(true);
        await html5QrCode.start(
          { facingMode: "environment" }, // Камера по умолчанию
          {
            fps: 10, // Частота сканирования
            qrbox: { width: 250, height: 250 }, // Размер области сканирования
          },
          (decodedText) => {
            setScanResult(decodedText); // Успешный результат
            html5QrCode.stop(); // Останавливаем сканер после успешного считывания
            setIsScanning(false);
          },
          (errorMessage) => {
            console.warn("Ошибка сканирования: ", errorMessage); // Лог ошибок сканирования
          }
        );
      } catch (err) {
        console.error("Ошибка запуска сканера: ", err);
        setError("Не удалось запустить сканер.");
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode) {
        html5QrCode
          .stop()
          .then(() => html5QrCode.clear())
          .catch((err) => console.warn("Ошибка остановки сканера: ", err));
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>QR Code Scanner</h1>
      <div
        id={scannerId}
        style={{ width: "300px", height: "300px", margin: "auto", border: "1px solid black" }}
      />
      {scanResult && <p style={{ color: "green" }}>Результат: {scanResult}</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {isScanning && <p>Сканируем...</p>}
    </div>
  );
};

export default Scanner;
