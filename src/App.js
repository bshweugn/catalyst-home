import { useEffect, useRef, useState } from 'react';
import '@ionic/react/css/core.css';
import { IonButton, setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { StatusBar, Style } from '@capacitor/status-bar';
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Homepage';
import Testpage from './Testpage';
import TabBar from './components/TabBar/TabBar';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';
import ModalHeader from './components/ModalHeader/ModalHeader';
import ProfileInfo from './components/ProfileInfo/ProfileInfo';

import avatar from './assets/images/user.jpeg'

setupIonicReact();

function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const profileModal = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
  }, []);

  const dismissProfileModal = () => {
    profileModal.current?.dismiss();
    setProfileModalOpen(false);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <div ref={pageRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Route
              path="/"
              exact
              render={() => <Homepage setAccessoryMode={setAccessoryMode} openProfileModal={() => setProfileModalOpen(true)} modalOpened={isProfileModalOpen} />}
            />
            <Route path="/test" exact component={Testpage} />
          </div>
        </IonRouterOutlet>
      </IonReactRouter>

      <IonModal
        isOpen={isProfileModalOpen}
        ref={profileModal}
        presentingElement={pageRef.current || undefined} // Передача presentingElement
        onDidDismiss={() => setProfileModalOpen(false)} // Сбрасываем состояние при закрытии модального окна
      >
        <IonHeader>
          {/* <IonToolbar>
            <IonTitle>Профиль пользователя</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={dismissProfileModal}>Закрыть</IonButton>
            </IonButtons>
          </IonToolbar> */}
          <ModalHeader title="Профиль" action={dismissProfileModal} />
        </IonHeader>
        <IonContent className="ion-padding">
          <ProfileInfo avatar={avatar} name="Евгений Башаримов" mail="bshv.evgn@gmail.com" />
        </IonContent>
      </IonModal>

      <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} />
      <TabBar />
    </IonApp>
  );
}

export default App;
