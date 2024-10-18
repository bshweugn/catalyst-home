import React from 'react';
import { IonItem, IonLabel, IonToggle } from '@ionic/react';
import './ToggleList.scss';

const ToggleList = ({ toggles, label }) => {
    return (
        <div className="toggle-list">
            <p className='text-input__label'>{label}</p>
            <div className='toggle-list__wrapper'>
                {toggles.map((toggle, index) => (
                    <div key={index} className="toggle-list__item">
                        <p className='toggle-list__toggle-label'>{toggle.label}</p>
                        <IonToggle
                            checked={toggle.value}
                            onIonChange={(e) => toggle.setter(e.detail.checked)}
                            className="toggle-list__toggle"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToggleList;
