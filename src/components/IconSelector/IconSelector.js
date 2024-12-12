import React from 'react';
import './IconSelector.scss';

const IconSelector = ({ label, components = [], selectedComponent, onSelect, className = '' }) => {
    const finalClassName = `icon-selector ${className}`;

    return (
        (components.length !== 0 ?
            <div className={finalClassName}>
                <p className="text-input__label">{label}</p>
                <div className="icon-selector__wrapper">
                    <div className="icon-selector__list">
                        {components.map((icon, index) => (
                            <div
                                key={index}
                                className={`icon-selector__icon-container ${icon === selectedComponent ? 'icon-selector__icon-container--active' : ''
                                    }`}
                                onClick={() => onSelect(icon)}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :
            <></>
        )
    );
};

export default IconSelector;
