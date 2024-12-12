import React from 'react';
import './DevicesShortPreview.scss';

const DevicesShortPreview = (args) => {
    const finalClassName = 'devices-short-preview ' + (args.className || '')
    return (
        <div className={finalClassName}>
        </div>
    );
};

export default DevicesShortPreview;
