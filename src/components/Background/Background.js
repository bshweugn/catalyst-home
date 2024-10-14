import React from 'react';
import './Background.scss';

const Background = (args) => {
    const finalClassName = 'background ' + (args.className || '')
    return (
        <div className={finalClassName} style={{backgroundImage: `url('${args.image}')`}}/>
    );
};

export default Background;
