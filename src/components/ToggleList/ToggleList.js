import React from 'react';
import { IonItem, IonLabel, IonToggle } from '@ionic/react';
import './ToggleList.scss';

const ToggleList = ({ toggles, label, light, bottomSeparated, separated }) => {
    return (
        <div className={`toggle-list ${light ? 'toggle-list--light' : ''} ${separated ? 'toggle-list--separated' : ''} ${bottomSeparated ? 'toggle-list--bottom-separated' : ''}`}>
            <p className='toggle-list__label'>{label}</p>
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
