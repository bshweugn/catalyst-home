import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header/Header';
import ItemsList from './components/ItemsList/ItemsList';
import PlusIcon from './components/icons/PlusIcon/PlusIcon';
import MainWidget from './components/MainWidget/MainWidget';
import TempStatus from './components/TempStatus/TempStatus';
import Row from './components/Row/Row';
import ProgressStatus from './components/ProgressStatus/ProgressStatus';
import Background from './components/Background/Background';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeRoomOrder, changeParameter, selectRoomsWithDevicesByHouseId } from './store';

import background from './assets/images/background.jpg';
import background1 from './assets/images/background1.jpg';
import background2 from './assets/images/background2.jpg';
import background3 from './assets/images/background3.jpeg';
import background4 from './assets/images/background4.JPG';
import background5 from './assets/images/background5.JPG';
import background6 from './assets/images/background6.JPG';
import background7 from './assets/images/background7.JPG';
import background8 from './assets/images/background8.JPG';
import background9 from './assets/images/background9.JPG';

import { IonContent, IonHeader, IonRefresher, IonRefresherContent, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import ItemWindow from './components/ItemWindow/ItemWindow';
import MainWidgetsRow from './components/MainWidgetsRow/MainWidgetsRow';
import RoomWindow from './components/RoomWindow/RoomWindow';
import More from './components/icons/More/More';
import Window from './components/Window/Window';
import House from './components/icons/House/House';
import Reorder from './components/icons/Reorder/Reorder';
import Section from './components/Section/Section';
import TextInput from './components/TextInput/TextInput';
import Avatar from './assets/images/user.jpeg'
import Egor from './assets/images/egor.jpeg'
import Tema from './assets/images/tema.jpeg'


import PeopleList from './components/PeopleList/PeopleList';
import BackgroundSelector from './components/BackgroundSelector/BackgroundSelector';
import Bell from './components/icons/Bell/Bell';
import Glance from './components/icons/Glance/Glance';
import ToggleList from './components/ToggleList/ToggleList';
import DraggableList from './components/DraggableList/DraggableList';
import CameraWindow from './components/CameraWindow/CameraWindow';
import CamerasList from './components/CamerasList/CamerasList';
import ScriptDevicesList from './components/ScriptDevicesList/ScriptDevicesList';
import CamerasVerticalList from './components/CamerasVerticalList/CamerasVerticalList';
import { useNavigate } from 'react-router-dom';


import store, {
    setDevice,
    setFav,
    removeDevice,
    setRoom,
    addDeviceToRoom,
    removeDeviceFromRoom,
    setFloor,
    addRoomToFloor,
    removeRoomFromFloor,
    setHouse,
    addFloorToHouse,
    removeFloorFromHouse,
    getDevicesWithoutCameras,
    getCamerasInHouse,
} from './store';
import { fetchHousesData, getRoomsAndDevicesByHouseId, ensureFloorExists, getFloorByRoomId } from './services/housesService';
import { getDevicesAndCamerasByRoomAndHouseId, getDevicesByHouseId } from './services/devicesService';
import CameraView from './components/CameraView/CameraView';
import CamerasRow from './components/CamerasRow/CamerasRow';
import RoomSelector from './components/RoomSelector/RoomSelector';
import RoomItemsList from './components/RoomItemsList/RoomItemsList';
import CameraStream from './components/CameraStream';



function Homepage(args) {
    const dispatch = useDispatch();
    // const devices = useSelector(state => state.devices);
    // const rooms = useSelector(state => state.rooms);
    // const settings = useSelector((state) => state.settings);

    // const roomsWithDevices = useSelector((state) =>
    //     selectRoomsWithDevicesByHouseId(state, 1)
    // );

    // const [allDevices, setAllDevices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchHousesData(args.token);
                if (data) {
                    args.setHouses(data);
                    console.log(data);
                    const devices = getDevicesByHouseId(data, args.currentHouseID);
                    args.setDevices(devices);
                    const roomsData = getRoomsAndDevicesByHouseId(args.currentHouseID, data);
                    args.setRooms(roomsData);
                    console.log(roomsData);

                    await ensureFloorExists(dispatch, args.token, args.currentHouseID, data);
                } else {
                    console.warn("Данные не были получены");
                }
            } catch (error) {
                console.error("Ошибка загрузки домов:", error);
            }
        };

        fetchData(args.token);
    }, [dispatch, args.token, args.currentHouseID]);

    const [pageBackground, setPageBackground] = useState(background6); // TODO: settings.background.image

    const [editMode, setEditMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [moreMode, setMoreMode] = useState(false);
    const pageRef = useRef(null);


    const [houseName, setHouseName] = useState('Мой дом');
    const [dragging, setDragging] = useState(false);

    const [optionIndex, setOptionIndex] = useState(0);

    const [itemID, setItemID] = useState(0);
    const [cameraID, setCameraID] = useState(0);
    const [selectedRoomID, setSelectedRoomID] = useState(-1);
    const [currentRoomId, setCurrentRoomId] = useState(0);

    const [toDeleteId, setToDeleteId] = useState(0);


    const navigate = useNavigate();


    useEffect(() => {
        console.log(currentRoomId);
    }, [currentRoomId]);


    useEffect(() => {
        setTimeout(() => { args.fetchData() }, 600);
    }, [toDeleteId]);



    // useEffect(() => {
    //     dispatch(changeParameter({ name: 'background', parameter: 'image', value: pageBackground }));
    // }, [pageBackground]);

    // useEffect(() => {
    //     console.log(devices)
    // }, [devices]);

    // useEffect(() => {
    //     console.log(roomsWithDevices)
    // }, [roomsWithDevices]);




    useEffect(() => {
        const handleScroll = () => {
            if (pageRef.current.scrollTop > 3 * 16) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        const pageElement = pageRef.current;
        if (pageElement) {
            pageElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (pageElement) {
                pageElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const [toggleStates, setToggleStates] = useState([
        { label: 'Удержание для действия', value: true, setter: (value) => handleToggleChange(0, value) },
        { label: 'Тактильный отклик', value: true, setter: (value) => handleToggleChange(1, value) },
    ]);

    const handleToggleChange = (index, value) => {
        const newToggles = [...toggleStates];
        newToggles[index].value = value;
        setToggleStates(newToggles);
    };


    const peopleData = [
        {
            image: Avatar,
            name: 'Евгений Башаримов',
            role: 'Жилец (Владелец)',
        },
        {
            image: Tema,
            name: 'Тёма Сорокин',
            role: 'Жилец',
        },
        {
            image: Egor,
            name: 'Егор Булко',
            role: 'Гость',
        },
    ];



    const [values, setValues] = useState([]);
    const [labels, setLabels] = useState([]);


    // useEffect(() => {
    //     const roomLabels = Object.keys(rooms).map(roomId => rooms[roomId].name);
    //     const roomIDs = Object.keys(rooms).map(roomId => rooms[roomId].id);
    //     setLabels(roomLabels);
    //     setValues(roomIDs);

    // }, [rooms]);


    // const handleOrderChange = (order) => {
    //     dispatch(changeRoomOrder({ newOrder: order }));
    // };

    const cards = [
        {
            title: "Настройка дома",
            label: "Общий доступ, люди, оформление",
            icon: House,
            content: (
                <>
                    <TextInput value={houseName} label="Имя дома" setValue={setHouseName} placeholder={""} />
                    <PeopleList people={peopleData} />
                    <BackgroundSelector background={pageBackground} setBackground={setPageBackground} label="Фоновое&nbsp;изображение" images={[background, background1, background2, background3, background4, background5, background6, background7, background8, background9]} />
                </>
            ),
        },
        {
            title: "Отображение",
            label: "Порядок секций, взаимодействие",
            icon: Reorder,
            content: (
                <>
                    <ToggleList bottomSeparated toggles={toggleStates} label="Взаимодействие" />
                    {/* <DraggableList
                        onChange={handleOrderChange}
                        label="Порядок секций"
                        items={Object.values(rooms).sort((a, b) => a.order - b.order)} // TODO: fix
                        labelField="name"
                        valueField="id"
                        onDropComplete={handleOrderChange}
                    /> */}
                </>
            ),
        },
        {
            title: "Уведомления",
            label: "Настройки уведомлений",
            icon: Bell,
            content: (
                <>
                    <TextInput value={houseName} label="Имя комнаты" setValue={setHouseName} placeholder={""} />
                </>
            ),
        },
        {
            title: "Glance",
            label: "Настройка отображения Glance",
            icon: Glance,
            content: (
                <>
                    <TextInput value={houseName} label="Имя комнаты" setValue={setHouseName} placeholder={""} />
                </>
            ),
        }
    ]


    useEffect(() => {
        if (args.token === undefined || args.token === null) {
            navigate('/auth');
            // console.log("to /auth " + args.token);
        }


    }, [args.token]);

    useEffect(() => {
        console.log(selectedRoomID)

    }, [selectedRoomID]);


    return (
        <>
            <Background image={pageBackground} />

            {args.rooms.map(room => (
                room.devices && room.devices.length > 0 && room.devices.map(device => (
                    <ItemWindow
                        key={`window-${device.id}`}
                        fetchData={args.fetchData}
                        device={device}
                        rooms={args.rooms}
                        room={room}
                        visible={device.id === itemID}
                        idFunc={setItemID}
                        houseId={args.currentHouseID}
                        token={args.token}
                        setToDeleteId={setToDeleteId}
                    />
                ))
            ))}


            {args.rooms.map(room => (
                room.cameras && room.cameras.length > 0 && room.cameras.map(camera => (
                    <CameraWindow
                        key={`window-${camera.id}`}
                        fetchData={args.fetchData}
                        token={args.token}
                        camera={camera}
                        rooms={args.rooms}
                        room={room}
                        visible={camera.id === cameraID}
                        idFunc={setCameraID}
                    />
                ))
            ))}

            {args.rooms
                .map(room => (
                    <RoomWindow fetchData={args.fetchData} token={args.token} room={room} visible={selectedRoomID === room.id} idFunc={setSelectedRoomID} floors={args.floors} floor={getFloorByRoomId(room.id, args.houses)}/>
                ))}

            {/* <Window title={houseName} visible={moreMode} idFunc={setMoreMode} currentIndex={optionIndex} setCurrentIndex={setOptionIndex} cards={cards} /> */}

            <IonHeader>
                <Header
                    title={"Мой дом"}
                    transparent={!isScrolled}
                    secondaryIcons={[PlusIcon, More]}
                    secondaryActions={[args.setAccessoryMode, setMoreMode]}
                    primaryLabel={["Править", "Готово"]}
                    primaryAction={[editMode, setEditMode]}
                    openProfileModal={args.openProfileModal}
                />
            </IonHeader>

            <IonContent className="ion-content" fullscreen={true} ref={pageRef}>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{args.currentPage === 0 ? houseName : args.currentPage === 1 ? "Аксессуары" : args.currentPage === 2 ? "Камеры" : "Автоматизации"}</IonTitle>
                    </IonToolbar>
                </IonHeader>


                <Section visible={args.currentPage === 0}>
                    <RoomSelector rooms={Object.values(args.rooms)} setRoomId={setCurrentRoomId} roomId={currentRoomId} />

                    {/* <MainWidgetsRow>
                        <MainWidget title="Климат" badge="Сейчас">
                            <Row>
                                <TempStatus temp="25" name="Термостат" status="Подогрев до 27°" />
                                <TempStatus className="temp-status--without-separator" temp="32" name="Тёплый пол" status="Текущая" />
                            </Row>
                        </MainWidget>
                        <MainWidget title="Качество воздуха" badge="Сейчас">
                            <ProgressStatus name="Качество воздуха" status="Хорошее" divisions={14} percentage={20} />
                        </MainWidget>
                    </MainWidgetsRow> */}

                    {/* <CamerasRow>
                        <CameraView name="Кухня" isRecording={true} image={background1} delay={2} />
                        <CameraView name="Гостиная" isRecording={false} image={background2} delay={4} />
                        <CameraView name="Улица" isRecording={true} image={background3} delay={2} />
                    </CamerasRow> */}

                    <CamerasList
                        rooms={args.rooms}
                        editMode={editMode}
                        setItemID={setCameraID}
                        openedID={cameraID}
                        roomId={currentRoomId}
                    />

                    <div className="page">
                        {/* <p>{args.token}</p> */}
                        {/* {Object.keys(rooms)
                            .sort((a, b) => rooms[a].order - rooms[b].order)
                            .map(roomId => {
                                const roomDevices = Object.keys(devices)
                                    .filter(deviceId =>
                                        devices[deviceId].roomID === rooms[roomId].id &&
                                        devices[deviceId].favourite === true
                                    )
                                    .map(deviceId => devices[deviceId]);

                                // console.log(`Room ${rooms[roomId].name}`, roomDevices);

                                if (roomDevices.length === 0) return null;

                                return (
                                    <ItemsList
                                        key={roomId}
                                        roomName={rooms[roomId].name}
                                        roomID={rooms[roomId].id}
                                        func={setSelectedRoomID}
                                        devices={roomDevices}
                                        editMode={editMode}
                                        setItemID={setItemID}
                                        openedID={itemID}
                                    />
                                );
                            })} */}

                        {/* {Object.values(args.rooms)
                            .filter((room) => currentRoomId === 0 || room.id === currentRoomId)
                            .map((room) => (
                                <ItemsList
                                    key={room.id}
                                    roomName={room.name}
                                    roomID={room.id}
                                    func={setSelectedRoomID}
                                    devices={room.devices}
                                    editMode={editMode}
                                    setItemID={setItemID}
                                    openedID={itemID}
                                    hiddenTitle={currentRoomId !== 0}
                                />
                            ))} */}

                        <RoomItemsList
                            rooms={Object.values(args.rooms)}
                            setSelectedRoomId={setSelectedRoomID}
                            setItemId={setItemID}
                            itemId={itemID}
                            currentRoomId={currentRoomId}
                            editMode={editMode}
                            toDeleteId={toDeleteId}
                        />
                    </div>



                </Section>

                <Section visible={args.currentPage === 1}>
                    <div className='page'>
                        {/* {Object.keys(rooms)
                            .sort((a, b) => rooms[a].order - rooms[b].order)
                            .map(roomId => {
                                const roomCameras = Object.keys(cameras)
                                    .filter(deviceId =>
                                        cameras[deviceId].roomID === rooms[roomId].id
                                    )
                                    .map(deviceId => cameras[deviceId]);

                                if (roomCameras.length === 0) return null;

                                return (
                                    <CamerasVerticalList
                                        key={roomId}
                                        roomName={rooms[roomId].name}
                                        roomID={rooms[roomId].id}
                                        func={setSelectedRoomID}
                                        cameras={roomCameras}
                                        rooms={rooms}
                                        editMode={editMode}
                                        setItemID={setCameraID}
                                        openedID={cameraID}
                                    />
                                );
                            })} */}
                            <CameraStream token={args.token}/>
                    </div>

                </Section>

                {/* <Section visible={args.currentPage === 2}>
                    <div className='page'>
                        <ScriptDevicesList devices={scriptDevices} />
                    </div>
                </Section> */}


            </IonContent>
        </>
    );
}

export default Homepage;
