import React from 'react';
import './Background.scss';

const Background = (args) => {
    const finalClassName = 'background ' + (args.className || '')
    return (
        // <div className={finalClassName} style={{backgroundImage: `url('${args.image}')`}}/>
        <div className={finalClassName}>
            <div className='background__top' style={{ backgroundImage: `url('${args.image}')` }}>
                <div className='background__fade' />
            </div>
        </div>
    );
};

export default Background;
