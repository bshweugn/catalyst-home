import React from 'react';
import './PeopleList.scss';
import PersonCard from '../PersonCard/PersonCard';

const PeopleList = ({ people }) => {
    return (
        <div className="people-list">
            <p className="people-list__title">Люди</p>
            <div className='people-list__wrapper'>
                {people.map((person, index) => (
                    <PersonCard
                        key={index}
                        image={person.image}
                        name={person.name}
                        role={person.role}
                    />
                ))}
            </div>
            <div className="people-list__description">
                Все люди в списке могут управлять и&nbsp;просматривать информацию о доме и&nbsp;устройствах в нём.
            </div>
        </div>
    );
};

export default PeopleList;
