import React, { useState, useRef } from 'react';
import { getCameraStream, setStream } from '../services/camerasService';

const CameraStream = (args) => {
    const [cameraId, setCameraId] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);

    const handleStartStream = async () => {
        setLoading(true);
        setError(null);
    
        try {
            const videoUrl = await getCameraStream(args.token, cameraId, timestamp);
    
            // // Устанавливаем URL в video-элемент
            // if (videoRef.current) {
            //     videoRef.current.src = videoUrl;
            //     videoRef.current.play();
            // }

            console.log(videoUrl)
        } catch (err) {
            setError('Не удалось загрузить стрим. Проверьте данные и попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Камера стрим</h1>
            <div>
                <label>
                    ID камеры:
                    <input
                        type="number"
                        value={cameraId}
                        onChange={(e) => setCameraId(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Временная метка:
                    <input
                        type="text"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        required
                    />
                </label>
            </div>
            <button onClick={handleStartStream} disabled={loading}>
                {loading ? 'Загрузка...' : 'Запустить стрим'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <video ref={videoRef} controls autoPlay style={{ width: '100%', marginTop: '20px' }} />
            </div>
        </div>
    );
};

export default CameraStream;
