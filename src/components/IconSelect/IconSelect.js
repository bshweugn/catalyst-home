import React from "react";
import "./IconSelect.scss";

const IconSelect = ({ options, selectedOption, setSelectedOption }) => {
    const handleSelect = (value) => {
        setSelectedOption(value);
    };

    return (
        <div className="icon-select">
            {options.map((option, index) => (
                <div
                    key={index}
                    className={`icon-select__option ${selectedOption === option.value
                            ? "icon-select__option--selected"
                            : ""
                        }`}
                    onClick={() => handleSelect(option.value)}
                >
                    <div className="icon-select__icon">{<option.icon size="1.3rem" fill="white" />}</div>
                    <span className={`icon-select__label ${selectedOption === option.value
                            ? "icon-select__label--selected"
                            : ""
                        }`}>{option.label}</span>
                </div>
            ))}
        </div>
    );
};

export default IconSelect;
