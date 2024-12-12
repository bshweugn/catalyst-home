import React from 'react';
import './BackgroundSelector.scss';

const BackgroundSelector = (args) => {
    const finalClassName = 'background-selector ' + (args.light ? 'background-selector--light' : '') + (args.className || '')
    return (
        <div className={finalClassName}>
            <p className='background-selector__label'>{args.label}</p>
            <div className='background-selector__wrapper'>
                <div className='background-selector__list'>
                    {args.images.map((image, index) => (
                        <div className={`background-selector__image-container ${image === args.background ? 'background-selector__image-container--active' : ''}`}>
                            <div className='background-selector__image' style={{ backgroundImage: `url(${image})` }} onClick={() => args.setBackground(image)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BackgroundSelector;
