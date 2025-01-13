import React, { useState, useEffect, useRef } from 'react';
import './ItemWindow.scss';
import VerticalSlider from '../VerticalSlider/VerticalSlider';
import HueSelector from '../HueSelector/HueSelector';
import HorizontalSelector from '../HorizontalSelector/HorizontalSelector';
import ActionButton from '../ActionButton/ActionButton';
import Sun from '../icons/Sun/Sun';
import Power from '../icons/Power/Power';
import { useDispatch } from 'react-redux';
import { isSensor, isVerticalControls, itemPrimaryType, renderItemIcon, renderItemStatus } from '../../itemInfo';
import StarOutline from '../icons/StarOutline/StarOutline';
import Star from '../icons/Star/Star';
import TempIndicator from '../TempIndicator/TempIndicator';
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
import { executeDeviceCommand, getDeviceById } from '../../services/devicesService';
import { fetchHousesData } from '../../services/housesService';
import { executeCameraCommand } from '../../services/camerasService';
import BatteryGauge from 'react-battery-gauge';



const ItemWindow = (args) => {
    const [device, setDevice] = useState(args.device);

    const [deviceStatus, setDeviceStatus] = useState(renderItemStatus(args.device));
    const [statusWidth, setStatusWidth] = useState('auto');
    const [isFading, setIsFading] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const statusRef = useRef(null);

    const [settingsVisible, setSettingsVisible] = useState(false);
    const [icons, setIcons] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState(<Lightbulb />);

    const [closeRequired, setCloseRequired] = useState(false);


    const getSetter = (deviceType) => {
        console.log(args.setters)
        if (args.setters !== undefined) {
            const device = args.setters.find(item => item.deviceType === deviceType);
            return device ? device?.setters : null;
        } else {
            return null;
        }
    }



    useEffect(() => {
        if (closeRequired) {
            args.idFunc(0);
            args.setToDeleteId(args.device?.id)
            setCloseRequired(false);
        }
    }, [closeRequired]);


    const updateStatus = (newStatus) => {
        setIsFading(true);
        setTimeout(() => {
            setDeviceStatus(newStatus);
            requestAnimationFrame(() => {
                updateStatusWidth();
                setIsFading(false);
            });
        }, 300);
    }



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


    const RobotPowerOptions = [
        {
            label: "Мин.",
            icon: DialLow,
            value: "LOW",
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

    const [state, setState] = useState(device?.state ?? '');
const [toggleState, setToggleState] = useState(device?.state ?? '');

const [mode, setMode] = useState(device?.features?.MODE ?? "NORMAL");
const [windMode, setWindMode] = useState(device?.features?.WIND_MODE ?? "SWING");

const [brightness, setBrightness] = useState(
    device?.features?.BRIGHTNESS !== undefined 
        ? device.status !== "OFF" 
            ? device.features.BRIGHTNESS 
            : 0 
        : 0
);

const [colorTemp, setColorTemp] = useState(device?.features?.COLOR_TEMP ?? 0);

const [targetTemp, setTargetTemp] = useState(device?.features?.TARGET_TEMP ?? 27);
const [currentTemp, setCurrentTemp] = useState(device?.features?.CURRENT_TEMP ?? 25);

const [currentHum, setCurrentHum] = useState(device?.features?.CURRENT_HUM ?? 35);
const [targetHum, setTargetHum] = useState(device?.features?.TARGET_HUM ?? 40);

const [fanSpeed, setFanSpeed] = useState(
    device?.features?.SPEED !== undefined 
        ? device.status !== "OFF" 
            ? device.features.SPEED 
            : 0 
        : 0
);

const [curtainPercentage, setCurtainPercentage] = useState(
    device?.features?.PERCENTAGE !== undefined 
        ? device.status !== "OPENED" 
            ? device.features.PERCENTAGE 
            : 0 
        : 0
);

const [suctionPower, setSuctionPower] = useState(device?.features?.SUCTION_POWER ?? "NORMAL");

const timerRef = useRef(null);


    /* -----------*/


    const fetchDeviceData = async () => {
        try {
            const result = await fetchHousesData(args.token);

            if (result) {
                setDevice(getDeviceById(device?.id, result));
                console.log(device);
            }
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
        }


        if (device?.status !== undefined) {
            setState(device?.status);
        }
        switch (itemPrimaryType(device)) {
            case "LAMP":
                if (device?.features.COLOR_TEMP !== undefined) {
                    setColorTemp(device?.features.COLOR_TEMP);
                }
                if (device?.features.BRIGHTNESS !== undefined) {
                    if (device?.status !== "OFF") {
                        setBrightness(device?.features.BRIGHTNESS);
                    }
                }
            case "THERMOSTAT":
                if (device?.features.TARGET_TEMP !== undefined) {
                    setTargetTemp(device?.features.TARGET_TEMP);
                }
                if (device?.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(device?.features.CURRENT_TEMP);
                }
                if (device?.features.MODE !== undefined) {
                    setMode(device?.features.MODE);
                }
            case "AC":
                if (device?.features.TARGET_TEMP !== undefined) {
                    setTargetTemp(device?.features.TARGET_TEMP);
                }
                if (device?.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(device?.features.CURRENT_TEMP);
                }
                if (device?.features.MODE !== undefined) {
                    setMode(device?.features.MODE);
                }
                if (device?.features.WIND_MODE !== undefined) {
                    setWindMode(device?.features.WIND_MODE);
                }
            case "TEMPERATURE":
                if (device?.features.CURRENT_TEMP !== undefined) {
                    setCurrentTemp(device?.features.CURRENT_TEMP);
                }
            case "CURTAIN":
                if (device?.features.PERCENTAGE !== undefined) {
                    setCurtainPercentage(device?.features.PERCENTAGE);
                }
            case "FAN":
                if (device?.features.SPEED !== undefined) {
                    setFanSpeed(device?.features.SPEED);
                }
        }
    }

    useEffect(() => {
        if (args.visible && !args.actionWindow) {
            fetchDeviceData();
        }
    }, [args.device, args.visible, settingsVisible]);


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


    /* ----- ПЕРЕКЛЮЧАТЕЛЬ КЛАПАНА И ШТОР -----*/

    const setValveOrCurtainStateWithToggle = (state) => {
        if (!state) {
            setToggleState("CLOSED");
        } else {
            setToggleState("OPENED");
        }
    }

    const getValveOrCurtainState = () => {
        return state === "OPENED";
    }

    /* ----------*/




    /* ----- ПЕРЕКЛЮЧАТЕЛЬ -----*/

    const setStateWithToggle = (state) => {
        if (!state) {
            setToggleState("OFF");
        } else {
            setToggleState("ON");
        }
    }

    const getState = () => {
        return toggleState === "ON";
    }

    /* ----------*/





    /* ----- ХЕНДЛЕРЫ ЛАМПЫ -----*/

    useEffect(() => {
        const handleBrightnessChange = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device?.id, "CHANGE_BRIGHTNESS", Math.round(brightness));
                if (result) {
                    console.log(result);
                    updateStatus(renderItemStatus(result.data));
                    setDevice((prevDevice) => ({
                        ...prevDevice,
                        features: {
                            ...prevDevice.features,
                            BRIGHTNESS: Math.round(brightness),
                        },
                    }));
                }

            } catch (error) {
                console.error('Ошибка при изменении яркости:', error);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (!args.actionWindow) {
                handleBrightnessChange();
            } else {
                getSetter("LAMP").brightness(Math.round(brightness));
                args.setActiveDeviceId(device?.id);
            }
        }, 200);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [brightness]);

    useEffect(() => {
        const handleColorTempChange = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device?.id, "CHANGE_COLOR_TEMPERATURE", colorTemp);
                if (result) {
                    console.log(result);
                    setDevice((prevDevice) => ({
                        ...prevDevice,
                        features: {
                            ...prevDevice.features,
                            COLOR_TEMP: colorTemp,
                        },
                    }));
                }

            } catch (error) {
                console.error('Ошибка при изменении цветовой температуры:', error);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (!args.actionWindow) {
                handleColorTempChange();
            } else {
                getSetter("LAMP").colorTemp(colorTemp);
                args.setActiveDeviceId(device?.id);
            }
        }, 200);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [colorTemp]);

    useEffect(() => {
        const handleToggle = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device?.id, toggleState === "ON" ? "TURN_ON" : "TURN_OFF", "");
                if (result) {
                    console.log(result);
                    setState(result.data.status);
                    updateStatus(renderItemStatus(result.data));
                }

            } catch (error) {
                console.error('Ошибка при изменении состояния:', error);
            }
        };

        if (!args.actionWindow) {
            handleToggle();
        } else {
            getSetter("COMMON").state(toggleState);
            args.setActiveDeviceId(device.id);

        }
    }, [toggleState]);

    /* ----------*/


    /* ----- ХЕНДЛЕРЫ КОНДИЦИОНЕРА И ТЕРМОСТАТА -----*/

    useEffect(() => {
        const handleModeChange = async () => {
            if (mode !== "OFF") {
                try {
                    const result = await executeDeviceCommand(args.token, device.id, "CHANGE_MODE", mode);
                    if (result) {
                        console.log(result);
                        setDevice((prevDevice) => ({
                            ...prevDevice,
                            features: {
                                ...prevDevice.features,
                                MODE: mode,
                            },
                        }));

                        if (device.status === "OFF") {
                            const result1 = await executeDeviceCommand(args.token, device.id, "TURN_ON", "");
                            if (result1) {
                                console.log(result1);
                                setDevice((prevDevice) => ({
                                    ...prevDevice,
                                    status: result1.data.status,
                                }));

                                updateStatus(renderItemStatus(result.data));
                            }
                        }
                    }

                } catch (error) {
                    console.error('Ошибка при изменении цветовой температуры:', error);
                }
            } else {
                console.log("OFF")
                try {
                    const result = await executeDeviceCommand(args.token, device.id, "TURN_OFF", "");
                    if (result) {
                        console.log(result);
                        setDevice((prevDevice) => ({
                            ...prevDevice,
                            status: result.data.status,
                        }));
                    }

                } catch (error) {
                    console.error('Ошибка при изменении цветовой температуры:', error);
                }
            }
        };


        if (!args.actionWindow) {
            handleModeChange();
        } else {
            getSetter("AC").mode(mode);
            args.setActiveDeviceId(device.id);
        }

    }, [mode]);

    useEffect(() => {
        const handleWindModeChange = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device.id, "CHANGE_WIND_MODE", windMode);
                if (result) {
                    console.log(result);
                    setDevice((prevDevice) => ({
                        ...prevDevice,
                        features: {
                            ...prevDevice.features,
                            WIND_MODE: windMode,
                        },
                    }));
                }

            } catch (error) {
                console.error('Ошибка при изменении цветовой температуры:', error);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (!args.actionWindow) {
                handleWindModeChange();
            } else {
                getSetter("AC").windMode(windMode);
                args.setActiveDeviceId(device.id);
            }
        }, 200);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [windMode]);

    useEffect(() => {
        const handleTargetTempChange = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device.id, "CHANGE_TARGET_TEMP", targetTemp);
                if (result) {
                    console.log(result);
                    setDevice((prevDevice) => ({
                        ...prevDevice,
                        features: {
                            ...prevDevice.features,
                            TARGET_TEMP: targetTemp,
                        },
                    }));
                }

            } catch (error) {
                console.error('Ошибка при изменении цветовой температуры:', error);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (!args.actionWindow) {
                handleTargetTempChange();
            } else {
                getSetter("AC").targetTemp(targetTemp);
                args.setActiveDeviceId(device.id);
            }
        }, 200);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [targetTemp]);

    useEffect(() => {
        const handleTargetHumChange = async () => {
            try {
                const result = await executeDeviceCommand(args.token, device.id, "CHANGE_TARGET_HUM", targetHum);
                if (result) {
                    console.log(result);
                    setDevice((prevDevice) => ({
                        ...prevDevice,
                        features: {
                            ...prevDevice.features,
                            TARGET_HUM: targetHum,
                        },
                    }));
                }

            } catch (error) {
                console.error('Ошибка при изменении цветовой температуры:', error);
            }
        };

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            if (!args.actionWindow) {
                handleTargetHumChange();
            } else {
                getSetter("HUMIDIFIER").targetHum(targetHum);
                args.setActiveDeviceId(device.id);
            }
        }, 200);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [targetHum]);

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
                        selectedOption={mode}
                        setSelectedOption={setMode}
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
                            selectedOption={mode}
                            setSelectedOption={setMode}
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
                        selectedOption={mode}
                        setSelectedOption={setMode}
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
        const newStatus = renderItemStatus(device);
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
    }, [device?.status, device?.features]);

    useEffect(() => {
        requestAnimationFrame(() => {
            updateStatusWidth();
        });
    }, []);

    return (
        <div
            className={`item-window 
                ${!args.visible && !args.actionWindow ? "item-window--hidden" : ""} 
                ${isVerticalControls(args.device) ? "item-window--vertical" : ""} 
                ${args.actionWindow ? "item-window--action-window" : ""}`}
        >
            {!args.actionWindow ? <ItemSettings
                fetchData={args.fetchData}
                rooms={args.rooms}
                room={args.room}
                name={args.device?.name}
                token={args.token}
                itemId={args.device?.id}
                device={args.device}
                houseId={args.houseId}
                visible={settingsVisible}
                visibilityFunc={setSettingsVisible}
                icons={icons}
                selectedIcon={selectedIcon}
                setSelectedIcon={setSelectedIcon}
                closeRequired={setCloseRequired}
            /> : null}
            <div className="item-window__back" />
            <div className={`item-window__header ${settingsVisible ? "item-window__header--hidden" : ""}`}>
                <div className="item-window__item-icon">{renderItemIcon(args.device)}</div>
                {device?.batteryLevel !== null ?
                    <div className='item-window__battery-wrapper'>
                        <div className='item-window__battery'>
                            <BatteryGauge value={device?.batteryLevel} size={30} customization={{
                                batteryBody: {
                                    strokeWidth: 6,
                                    cornerRadius: 12,
                                    strokeColor: "rgba(255, 255, 255, 0.2)"
                                },
                                batteryCap: {
                                    fill: 'none',
                                    strokeWidth: 4,
                                    strokeColor: "rgba(255, 255, 255, 0.2)",
                                    cornerRadius: 2,
                                    capToBodyRatio: 0.4
                                },
                                batteryMeter: {
                                    fill: "rgba(255, 255, 255, 0.8)",
                                    lowBatteryValue: 20,
                                    lowBatteryFill: 'red',
                                    outerGap: 6,
                                    interCellsGap: 1
                                },
                                readingText: {
                                    fontSize: 0,
                                    showPercentage: true
                                },
                            }} />
                        </div>
                        <p className='item-window__battery-percentage'>{device?.batteryLevel}%</p>
                    </div>
                    : null}
                <p className="item-window__close-btn" onClick={() => args.idFunc(0)}>Готово</p>
            </div>
            <div
                onClick={handleContentClick}
                className={`item-window__content ${settingsVisible ? "item-window__content--hidden" : ""}`}
            >
                <div className="item-window__item-info" onClick={handleContentClick}>
                    <p className="item-window__item-name">{device?.name}</p>
                    {!args.actionWindow ? <p className="item-window__room-name">
                        {args.room.name || "Неизвестная комната"}
                    </p> : null}
                    {deviceStatus && !args.actionWindow ?
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
            {!args.actionWindow ? <div className={`item-window__toolbar ${settingsVisible ? "item-window__toolbar--hidden" : ""}`}>
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
            </div> : null}
        </div>
    );

};

export default ItemWindow;
