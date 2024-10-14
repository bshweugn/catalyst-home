import React, { useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import './LightControl.scss';

const LightControl = () => {
  const [brightness, setBrightness] = useState(50); // состояние яркости
  const [colorTemp, setColorTemp] = useState(50);   // состояние температуры

  // Доступные цвета свечения
  const colorOptions = [
    { id: 1, color: '#A3D8FF' },  // Холодный свет
    { id: 2, color: '#FFEDD5' },  // Нейтральный свет
    { id: 3, color: '#FFD700' },  // Тёплый свет
  ];

  const handleBrightnessChange = (e) => {
    const newBrightness = parseInt(e.target.value, 10);
    setBrightness(newBrightness);

    if (newBrightness === 0 || newBrightness === 100) {
      Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  // Функция для обработки изменения температуры цвета
  const handleColorTempChange = (e) => {
    const newColorTemp = parseInt(e.target.value, 10);
    setColorTemp(newColorTemp);

    // Тактильная обратная связь при смене цвета
    Haptics.impact({ style: ImpactStyle.Light });
  };

  // Вычисление индекса цвета, который будет притягиваться к центру
  const getClosestColorIndex = () => {
    if (colorTemp <= 33) return 0;  // Холодный свет
    if (colorTemp <= 66) return 1;  // Нейтральный свет
    return 2;                       // Тёплый свет
  };

  const selectedColor = colorOptions[getClosestColorIndex()].color; // Цвет для внутреннего блока яркости

  return (
    <div className="light-control">
      {/* Слайдер яркости */}
      <div className="brightness-slider">
        <div className="brightness-track">
          <div
            className="brightness-fill"
            style={{
              height: `${brightness}%`,
              backgroundColor: selectedColor
            }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={handleBrightnessChange}
          className="slider-hidden"
          orientation="vertical"
        />
        <label>Brightness: {brightness}%</label>
      </div>

      {/* Вертикальный слайдер цвета свечения */}
      <div className="color-temp-slider">
        <label>Color Temperature</label>
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={colorTemp}
            onChange={handleColorTempChange}
            className="slider-vertical"
          />
          <div className="color-options">
            {colorOptions.map((option, index) => (
              <div
                key={option.id}
                className={`color-option ${index === getClosestColorIndex() ? 'active' : ''}`}
                style={{ backgroundColor: option.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightControl;
