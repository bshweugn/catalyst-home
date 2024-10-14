import React from 'react';
import './Navbar.scss';

const Navbar = (args) => {
    const finalClassName = 'navbar ' + (args.className || '')
    return (
        <div className={finalClassName}>
        </div>
    );
};

export default Navbar;
