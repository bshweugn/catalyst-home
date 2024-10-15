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

import background from './assets/images/background.jpg';
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

function Homepage(args) {
    const [editMode, setEditMode] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [addAccessoryMode, setAccessoryMode] = useState(false);
    const pageRef = useRef(null);
    const [presentingElement, setPresentingElement] = useState(null);

    const [itemID, setItemID] = useState(0);
    const [roomID, setRoomID] = useState(0);

    const [color, setColor] = useState("rgba(0, 0, 0, 0.1)");

    const [temp, setTemp] = useState("16");

    useEffect(() => {
        setPresentingElement(pageRef.current);
    }, []);


    useEffect(() => {
        console.log(temp);
    }, [temp])

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

    const lampDevice = {
        id: 123,
        type: 'LAMP',
        name: 'Главный свет',
        roomName: 'Гостиная',
        active: true,
        dimmable: true,
        dim: 100,
        status: 'ON',
        apiEndpoint: '/api/devices/lamp/lamp123/toggle',
        actionEnabled: true,
        color: "#FFD700",
        actionIcon: Power,
        icon: Lightbulb
    };

    const lampDevice2 = {
        id: 124,
        type: 'LAMP',
        name: 'Второй свет',
        roomName: 'Гостиная',
        active: false,
        dimmable: true,
        dim: 100,
        status: 'ON',
        apiEndpoint: '/api/devices/lamp/lamp123/toggle',
        actionEnabled: true,
        color: "#FFD700",
        actionIcon: Power,
        icon: Lightbulb
    };

    const thermostatDevice = {
        id: 456,
        type: 'THERMOSTAT',
        name: 'Термостат',
        roomName: 'Гостиная',
        active: false,
        currentTemp: 25,
        targetTemp: temp,
        status: (25 < temp ? 'HEATING' : 25 == temp ? 'HOLD' : 'COOLNG'),
        apiEndpoint: '/api/devices/thermostat/thermostat456',
        actionEnabled: false,
        actionIcon: Power,
        icon: Lightbulb
    };

    const mainRoom = {
        id: 1,
        name: 'Гостиная'
    }

    return (
        <>
            <Background image={background} />

            <ItemWindow device={lampDevice} visible={lampDevice.id === itemID} idFunc={setItemID}>
                <VerticalSlider sliderIcon={Sun} color={color} />
                <HueSelector setColorFunc={setColor} colors={["#74B9FF", "#B4D9FF", "#DEEEFF", "#FFFFFF", "#FFE8D6", "#FFD8B9", "#FFB073"]} />
            </ItemWindow>

            <ItemWindow device={lampDevice2} visible={lampDevice2.id === itemID} idFunc={setItemID}>
                <VerticalSlider sliderIcon={Sun} color={color} />
                <HueSelector setColorFunc={setColor} colors={["#74B9FF", "#B4D9FF", "#DEEEFF", "#FFFFFF", "#FFE8D6", "#FFD8B9", "#FFB073"]} />
            </ItemWindow>

            <ItemWindow vertical device={thermostatDevice} visible={thermostatDevice.id === itemID} idFunc={setItemID}>
                <HorizontalSelector values={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} append={"°"} selectedValue={temp} setValue={setTemp} />
                <ActionButton active icon={Power} labels={["Вкл.", "Выкл."]} />
            </ItemWindow>


            <RoomWindow room={mainRoom} visible={roomID === mainRoom.id} idFunc={setRoomID}>
            
            </RoomWindow>

            <IonHeader>
                <Header
                    title={"Мой дом"}
                    transparent={!isScrolled}
                    secondaryIcons={[PlusIcon]}
                    secondaryActions={[args.setAccessoryMode]}
                    primaryLabel={["Править", "Готово"]}
                    primaryAction={[editMode, setEditMode]}
                    openProfileModal={args.openProfileModal}
                />
            </IonHeader>

            <IonContent className="ion-content" fullscreen={true} ref={pageRef}>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Мой дом</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <MainWidgetsRow>
                    <MainWidget title="Климат" badge="Сейчас">
                        <Row>
                            <TempStatus temp="25" name="Термостат" status="Подогрев до 27°" />
                            <TempStatus className="temp-status--without-separator" temp="32" name="Тёплый пол" status="Текущая" />
                        </Row>
                        {/* <ProgressStatus name="Качество воздуха" status="Хорошее" divisions={11} percentage={20} /> */}
                    </MainWidget>
                    <MainWidget title="Качество воздуха" badge="Сейчас">
                        {/* <Row>
                            <TempStatus temp="25" name="Термостат" status="Подогрев до 27°" />
                            <TempStatus className="temp-status--without-separator" temp="32" name="Тёплый пол" status="Текущая" />
                        </Row> */}
                        <ProgressStatus name="Качество воздуха" status="Хорошее" divisions={14} percentage={20} />
                    </MainWidget>
                </MainWidgetsRow>

                <div className='page'>
                    <NotificationWidget iconColor={"#FF5500"} icon={MotionIcon} buttonIcon={VideoIcon} title="Безопасность" label="Обнаружено движение" />
                    <ItemsList roomName={"Гостиная"} roomID={1} func={setRoomID}>
                        <ItemCard opened={lampDevice.id === itemID} idFunc={setItemID} device={lampDevice} editMode={editMode} presentingElement={presentingElement} />
                        <ItemCard opened={thermostatDevice.id === itemID} idFunc={setItemID} device={thermostatDevice} editMode={editMode} presentingElement={presentingElement}>
                        </ItemCard>
                        <ItemCard opened={lampDevice2.id === itemID} idFunc={setItemID} device={lampDevice2} editMode={editMode} presentingElement={presentingElement} />
                        {/* <ItemCard opened={lampDevice2.id === itemID} idFunc={setItemID} device={lampDevice2} editMode={editMode} presentingElement={presentingElement} />
                        <ItemCard opened={lampDevice2.id === itemID} idFunc={setItemID} device={lampDevice2} editMode={editMode} presentingElement={presentingElement} /> */}
                    </ItemsList>
                </div>
            </IonContent>
        </>
    );
}

export default Homepage;
