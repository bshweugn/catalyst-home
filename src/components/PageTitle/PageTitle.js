import React from 'react';
import './PageTitle.scss';

const PageTitle = (args) => {
    const finalClassName = 'page-title ' + (args.className || '')
    return (
        <h1 className={finalClassName}>
            {args.text}
        </h1>
    );
};

export default PageTitle;
