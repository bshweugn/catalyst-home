import React, { useEffect, useState } from 'react';
import './CamerasList.scss';
import CameraView from '../CameraView/CameraView';
import CamerasRow from '../CamerasRow/CamerasRow';

const CamerasList = ({ cameras, rooms, editMode, setItemID, openedID }) => {

    const camerasArray = Object.values(cameras);

    return (
        <CamerasRow>
            {camerasArray.map((camera, index) => (
                <CameraView
                    key={camera.id}
                    index={index}
                    rooms={rooms}
                    camera={camera}
                    editMode={editMode}
                    idFunc={setItemID}
                    opened={camera.id === openedID}
                />
            ))}
            {/* <p>{JSON.stringify(cameras)}</p> */}
        </CamerasRow>
    );
};

export default CamerasList;
