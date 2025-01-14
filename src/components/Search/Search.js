import React from 'react';
import './Search.scss';
import MagGlass from '../icons/MagGlass/MagGlass';
import SuperEllipse from 'react-superellipse';

const Search = (args) => {
    const finalClassName = 'search ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className='search__wrapper'>
                <SuperEllipse
                    r1={0.1}
                    r2={0.35}
                    className={'search__background'}
                />
                <MagGlass size='0.875rem' fill='black' className='search__icon' />
                <p className='search__hint'>Поиск</p>
                {/* <input type='text' className='search__input' placeholder='Поиск аксессуаров' /> */}
            </div>
        </div>
    );
};

export default Search;
