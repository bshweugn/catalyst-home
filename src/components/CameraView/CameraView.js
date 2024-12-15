import React from 'react';
import './CameraView.scss';

const CameraView = ({ camera, room, className, idFunc, id, opened }) => {
    const finalClassName = 'camera-view ' + (opened ? "camera-view--opened" : "") + (className || '');

    return (
        <div className={finalClassName} onClick={() => idFunc(id)}>
            {/* <div className="camera-view__container" style={{ backgroundImage: `url(${camera.image})` }}> */}
            <div className="camera-view__container">

            </div>
            <div className='camera-view__info'>
                <p className='camera-view__camera-name'>{camera.name}</p>
                <div className='camera-view__camera-status'>
                    <p className='camera-view__rec-status'>
                        {room.roomName} · {camera.isRecording ? 'Запись' : 'Запись приостановлена'}
                    </p>
                </div>
            </div>
            <p className='camera-view__delay'>{camera.delay} с</p>
        </div>
    );
};

export default CameraView;
