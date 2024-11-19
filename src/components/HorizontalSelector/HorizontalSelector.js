import React, { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './HorizontalSelector.scss';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Pointer from "../icons/Pointer/Pointer";

function HorizontalSelector({ values, append, selectedValue, setValue, id }) {
    const splideRef = useRef(null);
    const [initialSlideIndex, setInitialSlideIndex] = useState(null);

    useEffect(() => {
        const index = values.indexOf(selectedValue);
        if (index !== -1) {
            setInitialSlideIndex(index); 
        }
    }, [selectedValue, values]);

    useEffect(() => {
        splideRef.current.splide.go(initialSlideIndex);
    }, [initialSlideIndex]);

    const handleMove = () => {
        Haptics.impact({ style: ImpactStyle.Light });
    };

    const handleChange = (newIndex) => {
        const newValue = values[newIndex];
        console.log(newValue + "+")
            setValue(newValue);
    };

    const options = {
        type: 'slide',
        perPage: 4,
        perMove: 1,
        focus: 'center',
        pagination: false,
        arrows: false,
        drag: true,
        snap: true,
        flickPower: 100,
        trimSpace: false
    };

    return (
        <div className="horizontal-selector">
            <div className="horizontal-selector__fade" />
            <div className="horizontal-selector__fade horizontal-selector__fade--second" />
            <div className="horizontal-selector__pointer">
                <Pointer size="0.75rem" color="white" />
            </div>
            <div className="horizontal-selector__wrapper">
                <Splide
                    options={options}
                    onMove={handleMove}
                    onActive={(splide, slide) => handleChange(slide.index)}
                    ref={splideRef}
                >
                    {values.map((value, index) => (
                        <SplideSlide className={"horizontal-selector__slide"} key={index}>
                            <div className="horizontal-selector__item">
                                <p className="horizontal-selector__value">{value}{append}</p>
                            </div>
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </div>
    );
}

export default HorizontalSelector;
