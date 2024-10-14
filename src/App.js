import { useEffect, useRef, useState } from 'react';
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
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
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Homepage';
import Testpage from './Testpage';
import TabBar from './components/TabBar/TabBar';
import AddAccessoryPopup from './components/AddAccessoryPopup/AddAccessoryPopup';

setupIonicReact();

function App() {
  const [addAccessoryMode, setAccessoryMode] = useState(false);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact render={() => <Homepage setAccessoryMode={setAccessoryMode}/>} />
          <Route path="/test" exact component={Testpage} />
        </IonRouterOutlet>
      </IonReactRouter>
      <AddAccessoryPopup visible={addAccessoryMode} func={setAccessoryMode} />
      <TabBar />
    </IonApp>
  );
}

export default App;
