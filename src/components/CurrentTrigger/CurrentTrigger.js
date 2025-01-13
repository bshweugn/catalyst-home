import React, { useState } from 'react';
import './CurrentTrigger.scss';
import { renderItemIcon } from '../../itemInfo';
import PlusIcon from '../icons/PlusIcon/PlusIcon';

const CurrentTrigger = (args) => {
    const finalClassName = 'current-trigger ' + (args.className || '')

    const renderLabel = (type, action, parameter) => {
        const [mainType, subType] = type.split('_');

        switch (mainType) {
            case "LEAK":
                if (action === "LEAK_DETECTED") {
                    return "Обнаружена протечка";
                }
            case "TEMPERATURE":
                if (action === "TEMP_EQUALS") {
                    return `Температура равна ${parameter}°C`;
                } else if (action === "TEMP_HIGHER_THAN") {
                    return `Температура выше ${parameter}°C`;
                } else if (action === "TEMP_LOWER_THAN") {
                    return `Температура ниже ${parameter}°C`;
                }
            case "HUMIDITY":
                if (action === "HUMIDITY_EQUALS") {
                    return `Влажность равна ${parameter}%`;
                } else if (action === "HUMIDITY_HIGHER_THAN") {
                    return `Влажность выше ${parameter}%`;
                } else if (action === "HUMIDITY_LOWER_THAN") {
                    return `Влажность ниже ${parameter}%`;
                }
            case "CAMERA":
                if (action === "MOTION_DETECTED") {
                    return `Обнаружено движение`;
                }
        }
    }


    



    return (
        <div className={finalClassName}>
            {/* <p className='text-input__label'>Условие активации</p> */}
            <div className='current-trigger__wrapper'>
                {args.trigger.id !== -1 ? (
                    <>
                        <div className='current-trigger__icon'>
                            {renderItemIcon(args.trigger.device)}
                        </div>
                        <div className='current-trigger__info' onClick={args.addFunc}>
                            <p className='current-trigger__name'>{args.trigger.device.name}</p>
                            <p className='current-trigger__state'>{renderLabel(args.trigger.device.deviceType, args.trigger.condition, args.trigger.parameter)}</p>
                        </div>
                    </>
                )
                    :
                    (<>
                        <div className='current-trigger__add-button' onClick={args.addFunc}>
                            <PlusIcon className='current-trigger__add-icon' size="1rem" fill="black" />
                            <p className='current-trigger__add-label'>Добавить условие</p>
                        </div>
                    </>)
                }
            </div>
        </div>
    );
};

export default CurrentTrigger;
