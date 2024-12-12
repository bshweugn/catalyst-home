import React from 'react';
import './TextInput.scss';


const TextInput = ({ value, label, setValue, placeholder, light, separated, bottomSeparated }) => {
  return (
    <div className={`text-input ${light ? 'text-input--light' : ''} ${separated ? 'text-input--separated' : ''} ${bottomSeparated ? 'text-input--bottom-separated' : ''}`}>
        <p className='text-input__label'>{label}</p>
      <input
        className="text-input__field"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Введите текст"}
      />
    </div>
  );
};

export default TextInput;
