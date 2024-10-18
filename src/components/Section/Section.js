import React from 'react';
import './Section.scss';

const Section = (args) => {
    const finalClassName = 'section ' + (args.visible ? 'section--visible ' : '') + (args.className || '')
    return (
        <div className={finalClassName}>
            {args.children}
        </div>
    );
};

export default Section;
