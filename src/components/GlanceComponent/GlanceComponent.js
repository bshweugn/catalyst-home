import React from 'react';
import './GlanceComponent.scss';

const GlanceComponent = (args) => {
    const finalClassName = 'glance-component ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <h1 className='glance-component__title'>Добрый день,<br />{args.name}</h1>
            <p className='glance-component__edit-btn' onClick={() => args.editAction[1](!args.editAction[0])}>
                {!args.editAction[0] ? "Править" : "Готово"}
            </p>
        </div>
    );
};

export default GlanceComponent;
