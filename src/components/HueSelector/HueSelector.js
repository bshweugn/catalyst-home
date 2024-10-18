import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import './HueSelector.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Pointer from "../icons/Pointer/Pointer";

function HueSelector({ colors, color, setColor }) {
    const sliderRef = useRef(null);
    const [isProgrammaticChange, setIsProgrammaticChange] = useState(false); // Флаг для отслеживания программных изменений

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
            if (!isProgrammaticChange) {
                // Haptics.impact({ style: ImpactStyle.Light });
                setColor(currentSlide);
            }
            setIsProgrammaticChange(false);
        }
    };

    useEffect(() => {
        if (sliderRef.current) {
            const initialSlideIndex = color;
            if (initialSlideIndex !== -1) {
                setIsProgrammaticChange(true); // Устанавливаем флаг перед программным изменением
                sliderRef.current.slickGoTo(initialSlideIndex);
            }
        }
    }, [color, colors]);

    return (
        <div className="hue-selector">
            <div className="hue-selector__selector" />
            <div className="hue-selector__pointer">
                <Pointer size="0.75rem" color="black" />
            </div>
            <div className="hue-selector__wrapper">
                <div className="hue-selector__fade" />
                <div className="hue-selector__fade hue-selector__fade--second" />
                <Slider ref={sliderRef} {...settings}>
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
