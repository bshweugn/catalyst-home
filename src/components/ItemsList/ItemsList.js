import React from 'react';
import './ItemsList.scss';

const ItemsList = (args) => {
    const finalClassName = 'items-list ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <h2 className='items-list__room-name'>{args.roomName}</h2>
            <div className='items-list__wrapper'>
                {args.children}
            </div>
        </div>
    );
};

export default ItemsList;
