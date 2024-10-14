import React from "react";
import Slider from "react-slick";
import './HueSelector.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Pointer from "../icons/Pointer/Pointer";

function HueSelector({ setColorFunc, colors }) {
    const settings = {
        infinite: false,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true,
        centerMode: true,
        centerPadding: "calc(50% + 6.25rem / 2)",
        draggable: true,
        onSwiped: (direction) => {
            if (direction === "down") {
                Haptics.impact({ style: ImpactStyle.Light });
            }
        },
        afterChange: (currentSlide) => {
            Haptics.impact({ style: ImpactStyle.Light });
            setColorFunc(colors[currentSlide]); // Устанавливаем цвет для текущего слайда
        }
    };

    return (
        <div className="hue-selector">
            <div className="hue-selector__selector" />
            <div className="hue-selector__pointer">
                <Pointer size="0.75rem" color="black" />
            </div>
            <div className="hue-selector__wrapper">
                <div className="hue-selector__fade" />
                <div className="hue-selector__fade hue-selector__fade--second" />
                <Slider {...settings}>
                    {colors.map((color, index) => (
                        <div
                            className="hue-selector__item"
                            key={index}
                        >
                            <div className="hue-selector__circle" style={{ backgroundColor: color }} />
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default HueSelector;
