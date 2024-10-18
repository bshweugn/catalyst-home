import React, { useState } from 'react';
import './ActionButton.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const ActionButton = (args) => {
    const [active, setActive] = useState(args.active);

    const hapticsImpactMedium = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    const finalClassName = 'action-button ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className={`action-button__btn ${active ? 'action-button__btn--active' : ''}`} onClick={() => {setActive(!active); hapticsImpactMedium()}}>
                <args.icon className='action-button__icon' size="1.5rem" color={active ? 'black' : 'white'}/>
            </div>
            <p className='action-button__label'>{args.labels[active ? 0 : 1]}</p>
        </div>
    );
};

export default ActionButton;
