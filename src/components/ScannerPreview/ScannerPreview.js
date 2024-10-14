import React from 'react';
import './ScannerPreview.scss';
import { IonSpinner } from '@ionic/react';

const ScannerPreview = (args) => {
    const finalClassName = 'scanner-preview ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <IonSpinner color={"light"}></IonSpinner>
        </div>
    );
};

export default ScannerPreview;
