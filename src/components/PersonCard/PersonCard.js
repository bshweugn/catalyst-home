import React from 'react';
import './PersonCard.scss';

const PersonCard = ({ image, name, role }) => {
    return (
        <div className="person-card">
            <div className="person-card__info">
                <img src={image} alt={name} className="person-card__image" />
                <div className="person-card__details">
                    <p className="person-card__name">{name}</p>
                    <p className="person-card__role">{role}</p>
                </div>
                <div className="person-card__arrow">
                    {/* <span className="person-card__arrow-icon">&gt;</span> */}
                </div>
            </div>
        </div>
    );
};

export default PersonCard;
