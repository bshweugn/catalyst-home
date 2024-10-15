import React from 'react';
import './ModalHeader.scss';

const ModalHeader = (args) => {
    const finalClassName = 'modal-header ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <p className='modal-header__title'>{args.title}</p>
            <p className='modal-header__btn' onClick={args.action}>Готово</p>
        </div>
    );
};

export default ModalHeader;
