import React, { useState, useEffect, useRef } from 'react';
import './ItemWindow.scss';
import VerticalSlider from '../VerticalSlider/VerticalSlider';
import HueSelector from '../HueSelector/HueSelector';
import HorizontalSelector from '../HorizontalSelector/HorizontalSelector';
import ActionButton from '../ActionButton/ActionButton';
import Sun from '../icons/Sun/Sun';
import Power from '../icons/Power/Power';
import { useDispatch } from 'react-redux';
import { setFav, setThermostatTemp, toggleDeviceStatus } from '../../store';
import { isSensor, isVerticalControls, itemPrimaryType, renderItemIcon, renderItemStatus } from '../../itemInfo';
import TextInput from '../TextInput/TextInput';
import StarOutline from '../icons/StarOutline/StarOutline';
import Star from '../icons/Star/Star';
import TempIndicator from '../TempIndicator/TempIndicator';
import Gear from '../icons/Gear/Gear';
import ItemSettings from '../ItemSettings/ItemSettings';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import DeskLamp from '../icons/DeskLamp/DeskLamp';
import CeilingLamp from '../icons/CeilingLamp/CeilingLamp';
import SimpleLabel from '../SimpleLabel/SimpleLabel';
import IconSelect from '../IconSelect/IconSelect';
import DialLow from '../icons/DialLow/DialLow';
import Curtains from '../icons/Curtains/Curtains';
import VerticalToggle from '../VerticalToggle/VerticalToggle';
import Fan from '../icons/Fan/Fan';



const ItemWindow = (args) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [icons, setIcons] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(<Lightbulb />);

    const [closeRequired, setCloseRequired] = useState(false);

    useEffect(() => {
        console.log("REQUIRED")
        if (closeRequired) {
            args.idFunc(0);
            args.setToDeleteId(args.device.id)
            setCloseRequired(false);
        }
    }, [closeRequired]);



    const thermostatPowerOptions = [
        {
            label: "Выкл.",
            icon: Power,
            value: "OFF",
        },
        {
            label: "Мин.",
            icon: DialLow,
            value: "SOFT",
        },
        {
            label: "Норм.",
            icon: DialLow,
            value: "MORMAL",
        },
        {
            label: "Макс.",
            icon: DialLow,
            value: "MAX",
        },
    ];

    const ACPowerOptions = [
        {
            label: "Выкл.",
            icon: Power,
            value: "OFF",
        },
        {
            label: "Мин.",
            icon: DialLow,
            value: "SOFT",
        },
        {
            label: "Норм.",
            icon: DialLow,
            value: "NORMAL",
        },
        {
            label: "Макс.",
            icon: DialLow,
            value: "MAX",
        },
    ];

    const ACWindOptions = [
        {
            label: "Авто",
            icon: Power,
            value: "SWING",
        },
        {
            label: "Низ",
            icon: DialLow,
            value: "DOWN",
        },
        {
            label: "Середина",
            icon: DialLow,
            value: "MIDDLE",
        },
        {
            label: "Верх",
            icon: DialLow,
            value: "UP",
        },
    ];


    const humidifierPowerOptions = [
        {
            label: "Выкл.",
            icon: Power,
            value: "OFF",
        },
        {
            label: "Мин.",
            icon: DialLow,
            value: "SOFT",
        },
        {
            label: "Норм.",
            icon: DialLow,
            value: "NORMAL",
        },
        {
            label: "Макс.",
            icon: DialLow,
            value: "MAX",
        },
    ];


    /* ----- БЛОК ПЕРЕМЕННЫХ ------*/

    const [state, setState] = useState("OFF");

    const [mode, setMode] = useState("");

    const [windMode, setWindMode] = useState("");

    const [brightness, setBrightness] = useState(0);
    const [colorTemp, setColorTemp] = useState(0);

    const [targetTemp, setTargetTemp] = useState(0);
    const [currentTemp, setCurrentTemp] = useState(0);

    const [currentHum, setCurrentHum] = useState(0);
    const [targetHum, setTargetHum] = useState(0);

    const [fanSpeed, setFanSpeed] = useState(0);

    const [curtainPercentage, setCurtainPercentage] = useState(0);

    /* -----------*/


    const fetchDeviceData = () => {
        if (args.device.status !== undefined) {
            setState(args.device.status);
        }
        switch (itemPrimaryType(args.device)) {
            case "LAMP":
                if (args.device.features.COLOR_TEMP !== undefined) {
                    setColorTemp(args.device.features.COLOR_TEMP);
                }
                if (args.device.features.BRIGHTNESS !== undefined) {
                    setBrightness(args.device.features.BRIGHTNESS);
                }
            case "THERMOSTAT":
                if (args.device.features.TARGET_TEMP !== undefined) {
                    setTargetTemp(args.device.features.TARGET_TEMP);
                }
                if (args.device.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(args.device.features.CURRENT_TEMP);
                }
                if (args.device.features.MODE !== undefined) {
                    setMode(args.device.features.MODE);
                }
            case "AC":
                if (args.device.features.TARGET_TEMP !== undefined) {
                    setTargetTemp(args.device.features.TARGET_TEMP);
                }
                if (args.device.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(args.device.features.CURRENT_TEMP);
                }
                if (args.device.features.MODE !== undefined) {
                    setMode(args.device.features.MODE);
                }
                if (args.device.features.WIND_MODE !== undefined) {
                    setWindMode(args.device.features.WIND_MODE);
                }
            case "TEMPERATURE":
                if (args.device.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(args.device.features.CURRENT_TEMP);
                }
            case "CURTAIN":
                if (args.device.features.PERCENTAGE !== undefined) {
                    setCurtainPercentage(args.device.features.PERCENTAGE);
                }
            case "FAN":
                if (args.device.features.SPEED !== undefined) {
                    setFanSpeed(args.device.features.SPEED);
                }
        }
    }

    useEffect(() => {
        fetchDeviceData();
    }, [args.device, args.visible]);


    /* ----- РЕЖИМЫ ТЕРМОСТАТА, КОНДИЦИОНЕРА И УВЛАЖНИТЕЛЯ -----*/

    const getThermoOrHumMode = () => {
        if (state === "OFF") {
            return state;
        } else {
            return mode;
        }
    }

    const setThermoOrHumMode = (mode) => {
        if (mode === "OFF") {
            setState("OFF")
        } else {
            setState("ON");
            setMode(mode)
        }
    }

    /* ----------*/


    /* ----- ПЕРЕКЛЮЧАТЕЛЬ КЛАПАНА -----*/

    const setValveOrCurtainStateWithToggle = (state) => {
        if (!state) {
            setState("CLOSED");
        } else {
            setState("OPENED");
        }
    }

    const getValveOrCurtainState = () => {
        return state === "OPENED";
    }

    /* ----------*/


    /* ----- ПЕРЕКЛЮЧАТЕЛЬ -----*/

    const setStateWithToggle = (state) => {
        if (!state) {
            setState("OFF");
        } else {
            setState("ON");
        }
    }

    const getState = () => {
        return state === "ON";
    }

    /* ----------*/





    const dispatch = useDispatch();

    const handleContentClick = (event) => {
        if (event.target === event.currentTarget) {
            args.idFunc(0);
        }
    };

    useEffect(() => {
        if (args.device.deviceType === 'LAMP') {
            setIcons([<Lightbulb />, <DeskLamp />, <CeilingLamp />]);
        }
    }, [args.device.deviceType]);

    const renderDeviceControls = () => {
        const [mainType, subType] = (args.device.deviceType || args.device.type || "").split('_');

        if (mainType === 'LAMP') {
            return (
                <>
                    {args.device.features.BRIGHTNESS !== undefined ? <VerticalSlider sliderIcon={Sun} setValue={setBrightness} value={brightness} /> : null}
                    {args.device.features.COLOR_TEMP !== undefined ? <HueSelector colors={["#74B9FF", "#B4D9FF", "#DEEEFF", "#FFFFFF", "#FFE8D6", "#FFD8B9", "#FFB073"]} color={colorTemp} setColor={setColorTemp} /> : null}
                    {args.device.features.BRIGHTNESS === undefined ? <VerticalToggle setValue={setStateWithToggle} value={getState()} /> : null}
                </>
            )
        }

        if (mainType === 'RELAY') {
            return (
                <>
                    <VerticalToggle setValue={setStateWithToggle} value={getState()} />
                </>
            )
        }

        if (mainType === 'CURTAIN') {
            if (args.device.features.PERCENTAGE !== undefined) {
                return (
                    <>
                        <VerticalSlider sliderIcon={Curtains} setValue={setCurtainPercentage} value={curtainPercentage} />
                    </>
                );
            } else {
                return (
                    <>
                        <VerticalToggle setValue={setValveOrCurtainStateWithToggle} value={getValveOrCurtainState()} />
                    </>
                );
            }
        }

        if (mainType === 'THERMOSTAT') {
            return (
                <>
                    <TempIndicator temp={currentTemp} append={"°"} />
                    <HorizontalSelector values={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} append={"°"} selectedValue={targetTemp} setValue={setTargetTemp} />
                    {args.device.features.MODE !== undefined ? <IconSelect
                        options={thermostatPowerOptions}
                        selectedOption={getThermoOrHumMode()}
                        setSelectedOption={setThermoOrHumMode}
                    /> : <ActionButton active={getState()} setActive={setStateWithToggle} icon={Power} labels={["Вкл.", "Выкл."]} />}
                    {/* <ActionButton active={args.device.status === 'HEATING'} icon={Power} labels={["Вкл.", "Выкл."]} /> */}
                </>
            );
        }

        if (mainType === 'HUMIDIFIER') {
            return (
                <>
                    <TempIndicator temp={currentHum} append={"%"} />
                    <HorizontalSelector values={[20, 25, 30, 35, 40, 45, 50, 55, 60]} append={""} selectedValue={targetHum} setValue={setTargetHum} />
                    {args.device.features.MODE !== undefined ?
                        <IconSelect
                            options={humidifierPowerOptions}
                            selectedOption={getThermoOrHumMode()}
                            setSelectedOption={setThermoOrHumMode}
                        /> : <ActionButton active={getState()} setActive={setStateWithToggle} icon={Power} labels={["Вкл.", "Выкл."]} />
                    }
                    {/* <ActionButton active={args.device.status === 'HEATING'} icon={Power} labels={["Вкл.", "Выкл."]} /> */}
                </>
            );
        }

        if (mainType === 'AC') {
            return (
                <>
                    <TempIndicator temp={currentTemp} append={"°"} />
                    <HorizontalSelector values={[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} append={"°"} selectedValue={targetTemp} setValue={setTargetTemp} />
                    {args.device.features.MODE !== undefined ? <IconSelect
                        options={ACPowerOptions}
                        selectedOption={getThermoOrHumMode()}
                        setSelectedOption={setThermoOrHumMode}
                    /> : null}
                    {args.device.features.WIND_MODE !== undefined ? <IconSelect
                        options={ACWindOptions}
                        selectedOption={windMode}
                        setSelectedOption={setWindMode}
                    /> : null}
                    {args.device.features.MODE === undefined ? <ActionButton active={getState()} setActive={setStateWithToggle} icon={Power} labels={["Вкл.", "Выкл."]} /> : null}
                </>
            );
        }

        if (mainType === 'TEMPERATURE') {
            return (
                <>
                    <TempIndicator temp={currentTemp} append={"°"} />
                    <SimpleLabel>Текущая температура</SimpleLabel>
                </>
            );
        }

        if (mainType === 'VALVE') {
            return (
                <>
                    <VerticalToggle setValue={setValveOrCurtainStateWithToggle} value={getValveOrCurtainState()} />
                </>
            );
        }

        if (mainType === 'FAN') {
            if (args.device.features.SPEED === undefined) {
                return (
                    <>
                        <VerticalToggle setValue={setValveOrCurtainStateWithToggle} value={getValveOrCurtainState()} />
                    </>
                )
            } else {
                return (
                    <>
                        <VerticalSlider sliderIcon={Fan} setValue={setFanSpeed} value={fanSpeed} />
                    </>
                )
            }
        }

        if (isSensor(args.device)) {
            return (
                <>
                    {/* <TextInput value="Имя" label="Имя сенсора"/> */}
                </>
            );
        }
    };

    const [deviceStatus, setDeviceStatus] = useState(renderItemStatus(args.device));
    const [statusWidth, setStatusWidth] = useState('auto');
    const [isFading, setIsFading] = useState(false);
    const [isFav, setIsFav] = useState(args.device.favourite);
    const statusRef = useRef(null);

    const handleFavChange = (dID, fav) => {
        // dispatch(setFav({ id: dID, favourite: fav })); // TODO: fix
    };

    useEffect(() => {
        handleFavChange(args.device.id, isFav);
    }, [isFav])

    const updateStatusWidth = () => {
        const currentWidth = statusRef.current?.offsetWidth || 0;
        setStatusWidth(currentWidth + 32);
    };

    useEffect(() => {
        const newStatus = renderItemStatus(args.device);
        if (newStatus !== deviceStatus) {
            setIsFading(true);
            setTimeout(() => {
                setDeviceStatus(newStatus);
                requestAnimationFrame(() => {
                    updateStatusWidth();
                    setIsFading(false);
                });
            }, 300);
        }
    }, [args.device.status, args.device.dim, args.device.targetTemp]);

    useEffect(() => {
        requestAnimationFrame(() => {
            updateStatusWidth();
        });
    }, []);

    return (
        <div
            className={`item-window 
                ${!args.visible ? "item-window--hidden" : ""} 
                ${isVerticalControls(args.device) ? "item-window--vertical" : ""}`}
        >
            <ItemSettings
                fetchData={args.fetchData}
                rooms={args.rooms}
                room={args.room}
                name={args.device.name}
                token={args.token}
                itemId={args.device.id}
                device={args.device}
                houseId={args.houseId}
                visible={settingsVisible}
                visibilityFunc={setSettingsVisible}
                icons={icons}
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
                closeRequired={setCloseRequired}
            />
            <div className="item-window__back" />
            <div className={`item-window__header ${settingsVisible ? "item-window__header--hidden" : ""}`}>
                <div className="item-window__item-icon">{renderItemIcon(args.device)}</div>
                <p className="item-window__header-title">{args.device.deviceName}</p>
                <p className="item-window__close-btn" onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div
                onClick={handleContentClick}
                className={`item-window__content ${settingsVisible ? "item-window__content--hidden" : ""}`}
            >
                <div className="item-window__item-info" onClick={handleContentClick}>
                    <p className="item-window__item-name">{args.device.name}</p>
                    <p className="item-window__room-name">
                        {args.room.name || "Неизвестная комната"}
                    </p>
                    {deviceStatus ?
                        <div className="item-window__item-status" style={{ width: statusWidth }}>
                            <p ref={statusRef} className={isFading ? "fading" : ""}>{deviceStatus}</p>
                        </div>
                        :
                        null
                    }
                </div>
                <div className="item-window__content-wrapper" onClick={handleContentClick}>
                    {renderDeviceControls()}
                </div>
            </div>
            <div className={`item-window__toolbar ${settingsVisible ? "item-window__toolbar--hidden" : ""}`}>
                <div
                    className="item-window__tool-btn item-window__tool-btn--circle"
                    onClick={() => {
                        setIsFav(!isFav);
                        Haptics.impact({ style: ImpactStyle.Light });
                    }}
                >
                    {isFav ? <Star size="1.2rem" color="white" /> : <StarOutline size="1.2rem" color="white" />}
                </div>
                <div className="item-window__tool-btn">
                    <p
                        className="item-window__tool-btn-label"
                        onClick={() => {
                            setSettingsVisible(true);
                            Haptics.impact({ style: ImpactStyle.Light });
                        }}
                    >
                        Параметры
                    </p>
                    {/* <Gear size="1.2rem" color="white" /> */}
                </div>
            </div>
        </div>
    );

};

export default ItemWindow;
