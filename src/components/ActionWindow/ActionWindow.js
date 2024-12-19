import React from 'react';
import './ActionWindow.scss';
import ItemWindow from '../ItemWindow/ItemWindow';

const ActionWindow = (args) => {
    const finalClassName = 'action-window ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <ItemWindow device={args.device} actionWindow idFunc={args.idFunc} />
        </div>
    );
};

export default ActionWindow;
