import React, { useState } from 'react';
import './DropdownSelect.scss';
import Checkmark from '../icons/Checkmark/Checkmark';

const DropdownSelect = ({ options, selectedOption, setSelectedOption, label }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-select">
            {/* <p className="dropdown-select__label">{label}</p> */}
            <div
                className={`dropdown-select__field ${isOpen ? 'dropdown-select__field--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <p className="dropdown-select__label">{label}</p>
                <p className="dropdown-select__selected-option">{selectedOption ? selectedOption : 'Не выбрано'}</p>
            </div>

            <div className={"dropdown-select__options " + (isOpen ? "dropdown-select__options--open" : "")} style={{maxHeight: (isOpen ? (48 * (options.length + 1)) + "px" : "46px")}}>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`dropdown-select__option ${selectedOption === option ? 'dropdown-select__option--selected' : ''}`}
                        onClick={() => handleOptionSelect(option)}
                    >
                        {option}
                        {selectedOption === option && <div className="dropdown-select__checkmark"><Checkmark size="0.875rem" fill='white' /></div>}
                    </div>
                ))}
                <div className="dropdown-select__option dropdown-select__option--add">
                    <button onClick={() => alert('Добавить')}>Добавить</button>
                </div>
            </div>
        </div>
    );
};

export default DropdownSelect;
