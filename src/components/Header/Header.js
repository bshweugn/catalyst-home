import React from 'react';
import './Header.scss';

const Header = (args) => {
    const finalClassName = 'header ' + (args.transparent ? 'header--transparent ' : '') + (args.className || '');
    return (
        <div className={finalClassName}>
            <div className="header__gradient-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className='header__user-profile-img'/>
            <h2 className='header__title'>{args.title}</h2>
            <div className='header__actions'>
                <div className='header__secondary-actions'>
                    {args.secondaryIcons.map((IconComponent, index) => (
                        <div className='header__secondary-action' onClick={() => {args.secondaryActions[index](true)}}>
                            <IconComponent
                                key={index}
                                size={'0.875rem'}
                                fill="black"
                            />
                        </div>
                    ))}
                </div>
                <p className='header__primary-action' onClick={() => args.primaryAction[1](!args.primaryAction[0])}>
                    {!args.primaryAction[0] ? args.primaryLabel[0] : args.primaryLabel[1]}
                </p>
            </div>
        </div>
    );
};

export default Header;
