import React, { useState, useEffect } from "react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import "./Scanner.scss";

const Scanner = ({ scannedData, setScannedData, className, scanning }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true; // Чтобы избежать утечек памяти

        const startScanning = async () => {
            try {
                setError("");

                // Проверка и запрос разрешений
                const status = await BarcodeScanner.checkPermission({ force: true });
                if (!status.granted) {
                    setError("Permission denied for accessing camera");
                    return;
                }

                // Скрываем фон и запускаем сканирование
                BarcodeScanner.hideBackground(); 
                setIsScanning(true);

                const result = await BarcodeScanner.startScan(); // Запускаем сканирование

                if (isMounted) {
                    if (result.hasContent) {
                        setScannedData(result.content);
                    } else {
                        setError("No QR code content found");
                    }
                }
            } catch (err) {
                if (isMounted) setError("Error accessing the camera or scanning");
            } finally {
                if (isMounted) setIsScanning(false);
            }
        };

        if (scanning) {
            startScanning();
        } else {
            // Останавливаем сканирование
            BarcodeScanner.showBackground();
            BarcodeScanner.stopScan();
            setIsScanning(false);
        }

        return () => {
            isMounted = false; // Прерываем асинхронные вызовы
        };
    }, [scanning, setScannedData]);

    const finalClassName = "scanner " + (className || "");

    return (
        <div className={finalClassName}>
            {scannedData && <p>Scanned Data: {scannedData}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {isScanning && <p>Scanning...</p>}
        </div>
    );
};

export default Scanner;
