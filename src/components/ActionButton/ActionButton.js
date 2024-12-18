import React, { useState } from 'react';
import './ActionButton.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const ActionButton = (args) => {

    const hapticsImpactMedium = async () => {
        await Haptics.impact({ style: ImpactStyle.Medium });
    };

    const finalClassName = 'action-button ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className={`action-button__btn ${args.active ? 'action-button__btn--active' : ''}`} onClick={() => {args.setActive(!args.active); hapticsImpactMedium()}}>
                <args.icon className='action-button__icon' size="1.5rem" color={args.active ? 'black' : 'white'}/>
            </div>
            <p className='action-button__label'>{args.labels[args.active ? 0 : 1]}</p>
        </div>
    );
};

export default ActionButton;
