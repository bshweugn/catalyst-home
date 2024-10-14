import React from 'react';
import './NotificationWidget.scss';
import MotionIcon from '../icons/MotionIcon/MotionIcon';

const NotificationWidget = (args) => {
    const finalClassName = 'notification-widget ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <args.icon size="1.625rem" fill={args.iconColor} className='notification-widget__icon' />
            <div className='notification-widget__pair'>
                <div className='notification-widget__title'>{args.title}</div>
                <div className='notification-widget__label'>{args.label}</div>
            </div>
            <div className='notification-widget__action-btn'>
                <args.buttonIcon size="1.625rem" fill={args.iconColor} className='notification-widget__btn-icon' />
            </div>
        </div>
    );
};

export default NotificationWidget;
