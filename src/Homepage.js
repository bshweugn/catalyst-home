import { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header/Header';
import ItemCard from './components/ItemCard/ItemCard';
import ItemsList from './components/ItemsList/ItemsList';
import Navbar from './components/Navbar/Navbar';
import PageTitle from './components/PageTitle/PageTitle';
import plus from './assets/icons/plus.svg';
import PlusIcon from './components/icons/PlusIcon/PlusIcon';
import MainWidget from './components/MainWidget/MainWidget';
import TempStatus from './components/TempStatus/TempStatus';
import Row from './components/Row/Row';
import DividedProgressBar from './components/DividedProgressBar/DividedProgressBar';
import ProgressStatus from './components/ProgressStatus/ProgressStatus';
import NotificationWidget from './components/NotificationWidget/NotificationWidget';
import MotionIcon from './components/icons/MotionIcon/MotionIcon';
import VideoIcon from './components/icons/VideoIcon/VideoIcon';
import Lightbulb from './components/icons/Lightbulb/Lightbulb';
import RobotVacuum from './components/icons/RobotVacuum/RobotVacuum';
import Background from './components/Background/Background';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleDeviceStatus, setDeviceDim, setThermostatTemp } from './store';

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
import Popup from './components/Popup/Popup';
import Power from './components/icons/Power/Power';
import Scanner from './components/Scanner/Scanner';
import ScannerPreview from './components/ScannerPreview/ScannerPreview';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';
import LampCard from './components/ devices/LampCard';
import { colorFill } from 'ionicons/icons';
import LightControl from './components/LightControl/LightControl';
import VerticalSlider from './components/VerticalSlider/VerticalSlider';
import Sun from './components/icons/Sun/Sun';
import HueSelector from './components/HueSelector/HueSelector';
import HorizontalSelector from './components/HorizontalSelector/HorizontalSelector';
import ItemWindow from './components/ItemWindow/ItemWindow';
import MainWidgetsRow from './components/MainWidgetsRow/MainWidgetsRow';
import ActionButton from './components/ActionButton/ActionButton';
import RoomWindow from './components/RoomWindow/RoomWindow';
import More from './components/icons/More/More';
import Window from './components/Window/Window';
import BtnCard from './components/BtnCard/BtnCard';
import House from './components/icons/House/House';
import Reorder from './components/icons/Reorder/Reorder';
import Section from './components/Section/Section';
import TextInput from './components/TextInput/TextInput';
import DropdownSelect from './components/DropdownSelect/DropdownSelect';
import Avatar from './assets/images/user.jpeg'
import Egor from './assets/images/egor.jpeg'
import Tema from './assets/images/tema.jpeg'


import PeopleList from './components/PeopleList/PeopleList';
import BackgroundSelector from './components/BackgroundSelector/BackgroundSelector';

function Homepage(args) {
    const [editMode, setEditMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [moreMode, setMoreMode] = useState(false);
    const pageRef = useRef(null);
    const [presentingElement, setPresentingElement] = useState(null);

    const [pageBackground, setPageBackground] = useState(background);

    const [houseName, setHouseName] = useState('Мой дом');

    const [optionIndex, setOptionIndex] = useState(0);

    const [itemID, setItemID] = useState(0);
    const [roomID, setRoomID] = useState(0);


    const dispatch = useDispatch();
    const devices = useSelector(state => state.devices);
    const rooms = useSelector(state => state.rooms);


    useEffect(() => {
        setPresentingElement(pageRef.current);
    }, []);


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


    const cards = [
        {
            title: "Настройка дома",
            label: "Настройте Ваш дом под себя",
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
            title: "Порядок секций",
            label: "Измените порядок отображения",
            icon: Reorder,
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

                    <div className='page'>
                        {/* <p>{devices.id123.id}</p> */}
                        {Object.keys(rooms).map(roomId => (
                            <ItemsList
                                key={roomId}
                                roomName={rooms[roomId].name}
                                roomID={rooms[roomId].id}
                                func={setRoomID}
                                devices={Object.keys(devices).filter(deviceId => devices[deviceId].roomID === rooms[roomId].id).map(deviceId => devices[deviceId])}
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
