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
import store from './store';

function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const profileModal = useRef(null);
  const pageRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  const dismissProfileModal = () => {
    profileModal.current?.dismiss();
    setProfileModalOpen(false);
  };

  setupIonicReact();

  return (
    <Provider store={store}>
      <IonApp>
        <Homepage currentPage={currentPage} setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} />
        <TabBar activeTab={currentPage} setActiveTab={setCurrentPage} />

        {/* Profile Modal */}
        <IonModal
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
        </IonModal>

        {/* Add Accessory Popup */}
        <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} />
      </IonApp>
    </Provider>
  );
}

export default App;
