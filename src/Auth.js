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
import Scanner from './components/Scanner/Scanner';
import ScriptDevicesList from './components/ScriptDevicesList/ScriptDevicesList';
import CamerasVerticalList from './components/CamerasVerticalList/CamerasVerticalList';
import AuthScreen from './components/AuthScreen/AuthScreen';

function Homepage(args) {
    const dispatch = useDispatch();

    return (
        <>
            <IonContent className="ion-content" fullscreen={true} ref={pageRef}>
                <AuthScreen />
            </IonContent>
        </>
    );
}

export default Homepage;
