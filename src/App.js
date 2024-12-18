import { useEffect, useRef, useState } from 'react';
import '@ionic/react/css/core.css';
import { IonApp, setupIonicReact } from '@ionic/react';
import Homepage from './Homepage';
import TabBar from './components/TabBar/TabBar';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';

import avatar from './assets/images/user.jpeg';
import { StatusBar, Style } from '@capacitor/status-bar';

import { Provider, useDispatch } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Sheet from './components/Sheet/Sheet';
import WideButton from './components/WideButton/WideButton';
import { logout } from './logic/oauth';
import AuthScreen from './components/AuthScreen/AuthScreen';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { getMyInfo } from './services/usersService';
import { fetchHousesData, getRoomsByHouseId } from './services/housesService';


function App() {
  const [currentHouseID, setCurrentHouseID] = useState(1);

  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [currentPage, setCurrentPage] = useState(0);
  const [popupView, setPopupView] = useState('default');



  const [houses, setHouses] = useState([]);
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);



  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  useEffect(() => {
    console.log(token);
  }, [token]);

  const handleLogout = async () => {
    await logout();
    setToken(null);
    setProfileModalOpen(false);
  };


  useEffect(() => {
    const handleTokenChange = () => {
      // const userInfo = getUserInfo(token);

      // if (userInfo) {
      //   setUsernameI(userInfo.username);
      //   setEmailI(userInfo.email);
      //   console.log("SET " + userInfo.username)
      // } else {
      //   setUsernameI(null);
      //   setEmailI(null);
      //   console.log("ERR")
      // }
    }

    const fetchUserData = async () => {
      try {
        const data = await getMyInfo(token);
        if (data) {
          setEmail(data.email);
          setUsername(data.name);
        } else {
          console.warn("Данные не были получены");
        }
      } catch (error) {
        console.error("Ошибка загрузки домов:", error);
      }
    };

    fetchUserData();

    // handleTokenChange();

    // window.addEventListener('storage', handleTokenChange);

    // return () => {
    //   window.removeEventListener('storage', handleTokenChange);
    // };
  }, [token]);


  const fetchData = async () => {
    try {
      const data = await fetchHousesData(token);
      if (data) {
        setHouses(data);
        const roomsData = getRoomsByHouseId(currentHouseID, data);
        setRooms(roomsData);
        // console.log("ROOMS " + roomsData)
      } else {
        console.warn("Данные не были получены");
      }
    } catch (error) {
      console.error("Ошибка загрузки домов:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [token, currentHouseID]);


  setupIonicReact();


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={
              <IonApp>
                <Homepage currentHouseID={currentHouseID} token={token} currentPage={currentPage} setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} rooms={rooms} houses={houses} devices={devices} setRooms={setRooms} setHouses={setHouses} setDevices={setDevices} />
                <TabBar activeTab={currentPage} setActiveTab={setCurrentPage} />

                <Sheet visible={isProfileModalOpen} func={setProfileModalOpen} title="Профиль">
                  <ProfileInfo avatar={avatar} name={username} mail={email} />
                  <WideButton light label="Выйти" onClick={() => handleLogout()} />
                </Sheet>

                <AddAccessoryPopup currentHouseID={currentHouseID} visible={addAccessoryMode} func={setAccessoryMode} view={popupView} token={token} setDevices={setDevices} setRooms={setRooms} setHouses={setHouses} devices={devices} houses={houses} rooms={rooms} />
              </IonApp>
            } />
            <Route path="/auth" element={
              <IonApp>
                <AuthScreen token={token} setToken={setToken} />
              </IonApp>
            } />
          </Routes>
        </Router>
      </PersistGate >
    </Provider >
  );
}

export default App;
