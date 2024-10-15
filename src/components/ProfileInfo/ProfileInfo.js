import React from 'react';
import './ProfileInfo.scss';

const ProfileInfo = (args) => {
    const finalClassName = 'profile-info ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className='profile-info__avatar' style={{backgroundImage: `url(${args.avatar})`}}/>
            <p className='profile-info__name'>{args.name}</p>
            <p className='profile-info__mail'>{args.mail}</p>
        </div>
    );
};

export default ProfileInfo;
