import React from 'react';
import './TextInput.scss';


const TextInput = ({ value, label, setValue, placeholder }) => {
  return (
    <div className="text-input">
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
