import React from 'react';
import './FavouritesList.scss';

const FavouritesList = (args) => {
    const finalClassName = 'favourites-list ' + (args.className || '')
    return (
        <div className={finalClassName}>
        </div>
    );
};

export default FavouritesList;
