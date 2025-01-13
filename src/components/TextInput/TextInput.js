import React from 'react';
import './TextInput.scss';

const TextInput = ({ value, label, setValue, placeholder, light, separated, bottomSeparated, onBlur, onFocus, password }) => {
  return (
    <div className={`text-input ${light ? 'text-input--light' : ''} ${separated ? 'text-input--separated' : ''} ${bottomSeparated ? 'text-input--bottom-separated' : ''}`}>
        <p className='text-input__label'>{label}</p>
      <input
        className="text-input__field"
        type={!password ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Введите текст"}
        onBlur={onBlur} // Добавлен onBlur для обработки завершения ввода
        onFocus={onFocus} // Добавлен onFocus для активации редактирования
      />
    </div>
  );
};

export default TextInput;
