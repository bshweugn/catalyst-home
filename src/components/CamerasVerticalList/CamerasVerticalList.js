import React from 'react';
import './CamerasVerticalList.scss';
import CameraView from '../CameraView/CameraView';
import CamerasRow from '../CamerasRow/CamerasRow';

const CamerasVerticalList = ({ cameras, rooms, editMode, setItemID, openedID, roomName, roomID, touchFunc }) => {

    const camerasArray = Object.values(cameras);

    return (
        <div className='cameras-vertical-list'>
            <h2 className='cameras-vertical-list__room-name' onClick={() => touchFunc(roomID)}>{roomName}</h2>
            <div className='cameras-vertical-list__wrapper'>
                {camerasArray.map((camera, index) => (
                    <CameraView
                        key={camera.id}
                        index={index}
                        rooms={rooms}
                        camera={camera}
                        editMode={editMode}
                        idFunc={setItemID}
                        id={camera.id}
                        opened={camera.id === openedID}
                    />
                ))}
            </div>
        </div>
    );
};

export default CamerasVerticalList;
