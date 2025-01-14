import React from 'react';
import './TextInput.scss';
import SuperEllipse from 'react-superellipse';

const TextInput = ({ value, label, setValue, placeholder, light, separated, bottomSeparated, onBlur, onFocus, password }) => {
  return (
    <div div className={`text-input ${light ? 'text-input--light' : ''} ${separated ? 'text-input--separated' : ''} ${bottomSeparated ? 'text-input--bottom-separated' : ''}`
    }>
      <p className='text-input__label'>{label}</p>
      <div className='text-input__wrapper'>
        {/* <SuperEllipse
          r1={0.1}
          r2={0.35}
          className={'text-input__background'}
        /> */}
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
    </div >
  );
};

export default TextInput;
