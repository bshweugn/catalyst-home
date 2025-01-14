import React from 'react';
import './Glance.scss';

const Glance = (args) => {
    const finalClassName = 'glance ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <h1>Добрый день,<br />{args.name}</h1>
            <p className='glance__edit-btn' onClick={() => args.editAction[1](!args.editAction[0])}>
                {!args.editAction[0] ? "Править" : "Готово"}
            </p>
        </div>
    );
};

export default Glance;
