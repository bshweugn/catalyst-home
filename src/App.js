import { useEffect, useRef, useState } from 'react';
import '@ionic/react/css/core.css';
import { IonApp, IonModal, IonHeader, IonContent, setupIonicReact } from '@ionic/react';
import Homepage from './Homepage';
import TabBar from './components/TabBar/TabBar';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';

import avatar from './assets/images/user.jpeg';
import { StatusBar, Style } from '@capacitor/status-bar';

import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Sheet from './components/Sheet/Sheet';
import WideButton from './components/WideButton/WideButton';
import { getUserInfo, login, logout, registerUser } from './logic/oauth';
import AuthScreen from './components/AuthScreen/AuthScreen';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';


function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const profileModal = useRef(null);
  const pageRef = useRef(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const [usernameI, setUsernameI] = useState('');
  const [emailI, setEmailI] = useState('');


  const [token, setToken] = useState(localStorage.getItem('token'));


  const [currentPage, setCurrentPage] = useState(0);

  const [popupView, setPopupView] = useState('default');

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

    // handleTokenChange();

    // window.addEventListener('storage', handleTokenChange);

    // return () => {
    //   window.removeEventListener('storage', handleTokenChange);
    // };
  }, [token]);


  setupIonicReact();


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={
              <IonApp>
                <Homepage token={token} currentPage={currentPage} setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} />
                <TabBar activeTab={currentPage} setActiveTab={setCurrentPage} />

                <Sheet visible={isProfileModalOpen} func={setProfileModalOpen} title="Профиль">
                  <ProfileInfo avatar={avatar} name={usernameI} mail={emailI} />
                  <WideButton light label="Выйти" onClick={() => handleLogout()} />
                </Sheet>

                <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} view={popupView} />
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
