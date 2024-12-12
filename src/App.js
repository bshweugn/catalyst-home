import { useEffect, useRef, useState } from 'react';
import '@ionic/react/css/core.css';
import { IonApp, IonRouterOutlet, IonModal, IonHeader, IonContent, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Homepage from './Homepage';
import Testpage from './Testpage';
import TabBar from './components/TabBar/TabBar';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';
import ModalHeader from './components/ModalHeader/ModalHeader';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';

import avatar from './assets/images/user.jpeg';
import { StatusBar, Style } from '@capacitor/status-bar';

import { Provider } from 'react-redux';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Sheet from './components/Sheet/Sheet';
import WideButton from './components/WideButton/WideButton';
import { registerUser } from './logic/oauth';

function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const profileModal = useRef(null);
  const pageRef = useRef(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const [token, setToken] = useState(localStorage.getItem('token'));


  const [currentPage, setCurrentPage] = useState(0);

  const [popupView, setPopupView] = useState('default');

  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);


  useEffect(() => {
    setToken(localStorage.getItem('token'));
    console.log("NEW " + token);
  }, [localStorage.getItem('token')]);


  const handleRegister = async () => {
    const userData = { username, email, password };

    try {
      const result = await registerUser(userData);

      if (result.token) {
        localStorage.setItem('token', result.token);
        setMessage('Registration successful!');
      } else {
        setMessage(result.response?.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };


  setupIonicReact();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IonApp>
          <Homepage currentPage={currentPage} setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} />
          <TabBar activeTab={currentPage} setActiveTab={setCurrentPage} />

          {/* <IonModal
            isOpen={isProfileModalOpen}
            ref={profileModal}
            presentingElement={pageRef.current || undefined}
            onDidDismiss={() => setProfileModalOpen(false)}
          >
            <IonHeader>
              <ModalHeader title="Профиль" action={dismissProfileModal} />
            </IonHeader>
            <IonContent className="ion-padding">
              <ProfileInfo avatar={avatar} name="Евгений Башаримов" mail="bshv.evgn@gmail.com" />
            </IonContent>
          </IonModal> */}

          {/* Add Accessory Popup */}

          <Sheet visible={isProfileModalOpen} func={setProfileModalOpen} title="Профиль">
            <ProfileInfo avatar={avatar} name="Евгений Башаримов" mail="bshv.evgn@gmail.com" />
            <WideButton light label="Выйти" />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>{message}</p>
            <button onClick={handleRegister}>Register</button>
          </Sheet>

          <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} view={popupView} />
        </IonApp>
      </PersistGate>
    </Provider>
  );
}

export default App;
