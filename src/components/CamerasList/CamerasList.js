import React from 'react';
import './CamerasList.scss';
import CameraView from '../CameraView/CameraView';
import CamerasRow from '../CamerasRow/CamerasRow';

const CamerasList = ({ rooms, editMode, setItemID, openedID, roomId, vertical }) => {
    // console.log('Rooms:', rooms);
    // console.log('Selected Room ID:', roomId);

    const camerasArray = rooms.flatMap(room => {
        // console.log('Processing Room:', room);
        if (roomId === 0 || room.roomId === roomId) {
            return (room.cameras || []).map(camera => ({ ...camera, room }));
        }
        return [];
    });

    // console.log('Filtered Cameras Array:', camerasArray);

    if (!vertical) {
        return (
            <CamerasRow>
                {
                    camerasArray.map((cameraWithRoom, index) => (
                        <CameraView
                            key={cameraWithRoom.id}
                            index={index}
                            camera={cameraWithRoom}
                            room={cameraWithRoom.room}
                            editMode={editMode}
                            idFunc={setItemID}
                            id={cameraWithRoom.id}
                            opened={cameraWithRoom.id === openedID}
                        />
                    ))
                }
            </CamerasRow>
        )
    } else {
        return (
            <>
                <div className='cameras-list__vertical-list'>
                    {
                        camerasArray.map((cameraWithRoom, index) => (
                            <CameraView
                                key={cameraWithRoom.id}
                                index={index}
                                camera={cameraWithRoom}
                                room={cameraWithRoom.room}
                                editMode={editMode}
                                idFunc={setItemID}
                                id={cameraWithRoom.id}
                                opened={cameraWithRoom.id === openedID}
                            />
                        ))
                    }
                </div>
            </>
        )
    }
};

export default CamerasList;
