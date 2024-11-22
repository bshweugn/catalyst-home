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
import { toggleDeviceStatus, setDeviceDim, setThermostatTemp, changeRoomOrder, changeParameter } from './store';

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

import Drop from './components/icons/Drop/Drop';
import { Link } from 'react-router-dom/cjs/react-router-dom';
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
import CameraView from './components/CameraView/CameraView';
import CamerasRow from './components/CamerasRow/CamerasRow';
import CameraWindow from './components/CameraWindow/CameraWindow';
import CamerasList from './components/CamerasList/CamerasList';

function Homepage(args) {
    const dispatch = useDispatch();
    const devices = useSelector(state => state.devices);
    const cameras = useSelector(state => state.cameras);
    const rooms = useSelector(state => state.rooms);
    const settings = useSelector((state) => state.settings);

    const [pageBackground, setPageBackground] = useState(settings.background.image);

    const [editMode, setEditMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [moreMode, setMoreMode] = useState(false);
    const pageRef = useRef(null);
    const [presentingElement, setPresentingElement] = useState(null);


    const [houseName, setHouseName] = useState('Мой дом');

    const [optionIndex, setOptionIndex] = useState(0);

    const [itemID, setItemID] = useState(0);
    const [cameraID, setCameraID] = useState(0);
    const [roomID, setRoomID] = useState(0);


    useEffect(() => {
        setPresentingElement(pageRef.current);
    }, []);


    useEffect(() => {
        dispatch(changeParameter({ name: 'background', parameter: 'image', value: pageBackground }));
    }, [pageBackground]);



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

    const mainRoom = {
        id: 1,
        name: 'Гостиная'
    }


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


    useEffect(() => {
        const roomLabels = Object.keys(rooms).map(roomId => rooms[roomId].name);
        const roomIDs = Object.keys(rooms).map(roomId => rooms[roomId].id);
        setLabels(roomLabels);
        setValues(roomIDs);

    }, [rooms]);

    // const handleOrderChange = (newValues) => {
    //     dispatch(changeRoomOrder({ newOrder: newValues }));
    // };

    const handleOrderChange = (order) => {
        // console.log("Новый порядок комнат:", order);
        dispatch(changeRoomOrder({ newOrder: order }));
        console.log(rooms);
    };

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
                    <ToggleList toggles={toggleStates} label="Взаимодействие" />
                    <DraggableList
                        onChange={handleOrderChange}
                        label="Порядок секций"
                        items={Object.values(rooms).sort((a, b) => a.order - b.order)}
                        labelField="name"
                        valueField="id"
                        onDropComplete={handleOrderChange}
                    />
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



    return (
        <>
            <Background image={pageBackground} />

            {Object.keys(devices).map(deviceId => (
                <ItemWindow
                    key={`window-${deviceId}`}
                    device={devices[deviceId]}
                    rooms={rooms}
                    visible={devices[deviceId].id === itemID}
                    idFunc={setItemID}
                />
            ))}

            {Object.keys(cameras).map(cameraId => (
                <CameraWindow
                    key={`window-${cameraId}`}
                    camera={cameras[cameraId]}
                    rooms={rooms}
                    visible={cameras[cameraId].id === cameraID}
                    idFunc={setCameraID}
                />
            ))}

            <RoomWindow room={mainRoom} visible={roomID === mainRoom.id} idFunc={setRoomID}></RoomWindow>

            <Window title={houseName} visible={moreMode} idFunc={setMoreMode} currentIndex={optionIndex} setCurrentIndex={setOptionIndex} cards={cards} />

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
                        <IonTitle size="large">{args.currentPage === 0 ? houseName : args.currentPage === 1 ? "Избранное" : "Автоматизация"}</IonTitle>
                    </IonToolbar>
                </IonHeader>


                <Section visible={args.currentPage === 0}>

                    <MainWidgetsRow>
                        <MainWidget title="Климат" badge="Сейчас">
                            <Row>
                                <TempStatus temp="25" name="Термостат" status="Подогрев до 27°" />
                                <TempStatus className="temp-status--without-separator" temp="32" name="Тёплый пол" status="Текущая" />
                            </Row>
                        </MainWidget>
                        <MainWidget title="Качество воздуха" badge="Сейчас">
                            <ProgressStatus name="Качество воздуха" status="Хорошее" divisions={14} percentage={20} />
                        </MainWidget>
                    </MainWidgetsRow>

                    {/* <CamerasRow>
                        <CameraView name="Кухня" isRecording={true} image={background1} delay={2} />
                        <CameraView name="Гостиная" isRecording={false} image={background2} delay={4} />
                        <CameraView name="Улица" isRecording={true} image={background3} delay={2} />
                    </CamerasRow> */}

                    <CamerasList
                        func={setRoomID}
                        rooms={rooms}
                        cameras={cameras}
                        editMode={editMode}
                        setItemID={setCameraID}
                        openedID={cameraID}
                    />

                    <div className='page'>
                        {Object.keys(rooms)
                            .sort((a, b) => rooms[a].order - rooms[b].order)
                            .map(roomId => (
                                <ItemsList
                                    key={roomId}
                                    roomName={rooms[roomId].name}
                                    roomID={rooms[roomId].id}
                                    func={setRoomID}
                                    devices={Object.keys(devices)
                                        .filter(deviceId => devices[deviceId].roomID === rooms[roomId].id)
                                        .map(deviceId => devices[deviceId])
                                    }
                                    editMode={editMode}
                                    setItemID={setItemID}
                                    openedID={itemID}
                                />
                            ))}
                    </div>


                </Section>

            </IonContent>
        </>
    );
}

export default Homepage;
