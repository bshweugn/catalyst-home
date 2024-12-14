import React, { useState } from 'react';
import './Select.scss';
import Checkmark from '../icons/Checkmark/Checkmark';

const Select = ({ options, selectedOption, setSelectedOption, label, light, actualOptions }) => {
    const handleOptionSelect = (index) => {
        setSelectedOption(-1, null, actualOptions[index], "");
    };

    return (
        <div className={`select ${light ? "select--light" : ""}`}>
            {/* <p className="select__label">{label}</p> */}
            <div className={"select__options "}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`select__option ${selectedOption === actualOptions[index] ? 'select__option--selected' : ''}`}
                        onClick={() => handleOptionSelect(index)}
                    >
                        {option}
                        {selectedOption === actualOptions[index] && <div className="select__checkmark"><Checkmark size="0.875rem" fill='white' /></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Select;
