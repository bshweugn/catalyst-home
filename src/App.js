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
import { getUserInfo, login, logout, registerUser } from './logic/oauth';
import AuthScreen from './components/AuthScreen/AuthScreen';
import { Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom';

function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const profileModal = useRef(null);
  const pageRef = useRef(null);

  const history = useHistory();

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


  const handleRegister = async () => {
    const token = await registerUser(username, email, password);
    setToken(token);
  };

  const handleLogin = async () => {
    const token = await login(email, password);
    setToken(token);
  };

  const handleLogout = async () => {
    await logout();
    setToken(null);
  };


  useEffect(() => {
    const handleTokenChange = () => {
      const userInfo = getUserInfo(token);

      if (userInfo) {
        setUsernameI(userInfo.username);
        setEmailI(userInfo.email);
        console.log("SET " + userInfo.username)
      } else {
        setUsernameI(null);
        setEmailI(null);
        console.log("ERR")
      }
    }

    if (token !== null) {
      // history.push('/');
    }

    handleTokenChange();

    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [token]);



  setupIonicReact();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/" exact>
                <Homepage currentPage={currentPage} setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} />
                <TabBar activeTab={currentPage} setActiveTab={setCurrentPage} />

                <Sheet visible={isProfileModalOpen} func={setProfileModalOpen} title="Профиль">
                  <ProfileInfo avatar={avatar} name={usernameI} mail={emailI} />
                  <WideButton light label="Выйти" onClick={() => handleLogout()} />

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
                  <button onClick={handleLogin}>Login</button>
                </Sheet>

                <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} view={popupView} />
              </Route>
              <Route path="/auth" exact>
                <AuthScreen token={token} setToken={setToken} />
              </Route>
              <Route>
                <Redirect to="/" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </PersistGate>
    </Provider>
  );
}

export default App;
