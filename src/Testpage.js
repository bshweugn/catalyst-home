import { useState, useEffect, useRef } from 'react';

import './App.css';
import { IonButton, IonContent, IonDatetime, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

function Testpage() {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonDatetime></IonDatetime>
                <IonButton fill="clear">Start</IonButton>
            </IonContent>
        </IonPage>
    );
}

export default Testpage;
