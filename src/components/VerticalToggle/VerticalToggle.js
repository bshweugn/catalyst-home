import React from 'react';
import './VerticalToggle.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const VerticalToggle = (args) => {
    const finalClassName = 'vertical-toggle ' + (args.className || '')
    return (
        <div className={finalClassName} onClick={() => {args.setValue(!args.value); Haptics.impact({ style: ImpactStyle.Medium });}}>
            <div className={`vertical-toggle__toggle ${args.value ? "vertical-toggle__toggle--active" : ""}`} />
            <p className={`vertical-toggle__label vertical-toggle__label--top ${!args.value ? "vertical-toggle__label--active" : ""}`}>1</p>
            <p className={`vertical-toggle__label vertical-toggle__label--bottom ${args.value ? "vertical-toggle__label--active" : ""}`}>0</p>
        </div>
    );
};

export default VerticalToggle;
