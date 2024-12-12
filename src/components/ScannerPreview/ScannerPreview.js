import React, { useEffect, useRef, useState } from 'react';
import './ScannerPreview.scss';
import { IonSpinner } from '@ionic/react';
import Scanner from '../Scanner/Scanner';

const ScannerPreview = ({ className, active }) => {
    const videoRef = useRef(null);
    const [scannedData, setScannedData] = useState("")

    useEffect(() => {
        // let stream;

        // const setupCamera = async () => {
        //     try {
        //         stream = await navigator.mediaDevices.getUserMedia({
        //             video: { facingMode: 'environment' }
        //         });
        //         if (videoRef.current) {
        //             videoRef.current.srcObject = stream;
        //             videoRef.current.play();
        //         }
        //     } catch (err) {
        //         console.error("Ошибка при доступе к камере: ", err);
        //     }
        // };

        // if (active) {
        //     setupCamera();
        // } else {
        //     // Выключаем камеру
        //     if (videoRef.current && videoRef.current.srcObject) {
        //         const stream = videoRef.current.srcObject;
        //         const tracks = stream.getTracks();
        //         tracks.forEach((track) => track.stop());
        //         videoRef.current.srcObject = null;
        //     }
        // }

        // // Очистка при размонтировании компонента
        // return () => {
        //     if (stream) {
        //         const tracks = stream.getTracks();
        //         tracks.forEach((track) => track.stop());
        //     }
        // };
    }, [active]); // Перезапускаем эффект при изменении active

    const finalClassName = 'scanner-preview ' + (className || '');

    return (
        <div className={finalClassName}>
            <IonSpinner className={"scanner-preview__spinner"} color={"light"}></IonSpinner>
            {/* <Scanner className={"scanner-preview__scanner"} scannedData={scannedData} setScannedData={setScannedData} scanning={active} /> */}
            {/* {active ? (
                <>
                    <video ref={videoRef} className="scanner-preview__camera-preview" muted playsInline></video>
                </>
            ) : (
                <div className="camera-disabled">Камера выключена</div>
            )} */}
        </div>
    );
};

export default ScannerPreview;
