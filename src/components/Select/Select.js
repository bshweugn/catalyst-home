import React, { useState } from 'react';
import './Select.scss';
import Checkmark from '../icons/Checkmark/Checkmark';

const Select = ({ options, selectedOption, setSelectedOption, label, light, actualOptions, setInputValue, inputValue, placeholder, append }) => {
    const handleOptionSelect = (index) => {
        setSelectedOption(-1, null, actualOptions[index], inputValue);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <div className={`select ${light ? "select--light" : ""}`}>
            <div className="select__options">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`select__option ${selectedOption === actualOptions[index]
                            ? "select__option--selected"
                            : ""
                            }`}
                        onClick={() => handleOptionSelect(index)}
                    >
                        {option}
                        {selectedOption === actualOptions[index] ? (
                            setInputValue ? (
                                <>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder={placeholder}
                                        className="select__input"
                                    />
                                    {append}
                                </>
                            ) : (
                                <div className="select__checkmark">
                                    <Checkmark size="0.875rem" fill="white" />
                                </div>
                            )
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Select;
