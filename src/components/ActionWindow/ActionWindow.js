import React, { useEffect, useState } from 'react';
import './ActionWindow.scss';
import ItemWindow from '../ItemWindow/ItemWindow';

const ActionWindow = (args) => {
    const finalClassName = 'action-window ' + (args.className || '');

    const [activeDeviceId, setActiveDeviceId] = useState(0);
    const [changes, setChanges] = useState([]); // Хранит список изменений

    const [state, setState] = useState(null);
    const [toggleState, setToggleState] = useState(null);
    const [mode, setMode] = useState(null);
    const [windMode, setWindMode] = useState(null);
    const [brightness, setBrightness] = useState(null);
    const [colorTemp, setColorTemp] = useState(null);
    const [targetTemp, setTargetTemp] = useState(null);
    const [currentTemp, setCurrentTemp] = useState(null);
    const [currentHum, setCurrentHum] = useState(null);
    const [targetHum, setTargetHum] = useState(null);
    const [fanSpeed, setFanSpeed] = useState(null);
    const [curtainPercentage, setCurtainPercentage] = useState(null);
    const [suctionPower, setSuctionPower] = useState(null);

    const resetSetters = () => {
        setState(null);
        setToggleState(null);
        setMode(null);
        setWindMode(null);
        setBrightness(null);
        setColorTemp(null);
        setTargetTemp(null);
        setCurrentTemp(null);
        setCurrentHum(null);
        setTargetHum(null);
        setFanSpeed(null);
        setCurtainPercentage(null);
        setSuctionPower(null);
    };

    useEffect(() => {
        resetSetters();
        setChanges([]);
    }, [activeDeviceId]);

    const parameterNameMap = {
        state: "STATE",
        toggleState: "TOGGLE_STATE",
        mode: "MODE",
        windMode: "WIND_MODE",
        brightness: "BRIGHTNESS",
        colorTemp: "COLOR_TEMP",
        targetTemp: "TARGET_TEMP",
        currentTemp: "CURRENT_TEMP",
        currentHum: "CURRENT_HUM",
        targetHum: "TARGET_HUM",
        fanSpeed: "FAN_SPEED",
        curtainPercentage: "CURTAIN_PERCENTAGE",
        suctionPower: "SUCTION_POWER",
    };

    const trackChanges = (name, value) => {
        if (value !== null) {
            setChanges((prev) => [
                ...prev.filter((change) => change.name !== name), // Удаляем старое значение, если оно есть
                { name, value },
            ]);
        }
    };

    useEffect(() => trackChanges("state", state), [state]);
    useEffect(() => trackChanges("toggleState", toggleState), [toggleState]);
    useEffect(() => trackChanges("mode", mode), [mode]);
    useEffect(() => trackChanges("windMode", windMode), [windMode]);
    useEffect(() => trackChanges("brightness", brightness), [brightness]);
    useEffect(() => trackChanges("colorTemp", colorTemp), [colorTemp]);
    useEffect(() => trackChanges("targetTemp", targetTemp), [targetTemp]);
    useEffect(() => trackChanges("currentTemp", currentTemp), [currentTemp]);
    useEffect(() => trackChanges("currentHum", currentHum), [currentHum]);
    useEffect(() => trackChanges("targetHum", targetHum), [targetHum]);
    useEffect(() => trackChanges("fanSpeed", fanSpeed), [fanSpeed]);
    useEffect(() => trackChanges("curtainPercentage", curtainPercentage), [curtainPercentage]);
    useEffect(() => trackChanges("suctionPower", suctionPower), [suctionPower]);

    const getActiveDeviceParameterString = () => {
        return changes
            .map(
                ({ name, value }) =>
                    `(${activeDeviceId}, "${parameterNameMap[name] || "UNKNOWN_PARAMETER"}", "${value}")`
            )
            .join(' -> '); // Каждое действие разделяется " -> "
    };
    
    const updateScriptString = () => {
        const newString = getActiveDeviceParameterString();
        args.setString((prevString) => {
            // Разбиваем предыдущую строку на действия
            const actions = prevString.split(" -> ").filter(Boolean);
    
            // Удаляем действия с тем же activeDeviceId и типами из changes
            const filteredActions = actions.filter((action) => {
                const matches = action.match(/\((\d+), "([^"]+)"/);
                if (!matches) return true; // Если строка не соответствует формату, оставляем ее
                const [_, deviceId, paramName] = matches;
                return !(Number(deviceId) === activeDeviceId && changes.some(({ name }) => parameterNameMap[name] === paramName));
            });
    
            // Добавляем новую строку к оставшимся действиям
            const resultString = ["", ...filteredActions, newString].join(" -> ").trim(); // Убираем лишние пробелы
    
            // Удаляем лишние стрелки и пробелы в начале и в конце
            return resultString.replace(/^->\s*/g, "").replace(/\s*->$/g, "");
        });
    };
    
    useEffect(() => {
        if (activeDeviceId && changes.length > 0) {
            updateScriptString();
        }
    }, [activeDeviceId, changes]);

    const setters = [
        {
            deviceType: "LAMP",
            setters: {
                brightness: setBrightness,
                colorTemp: setColorTemp,
                state: setState,
            },
        },
        {
            deviceType: "CURTAIN",
            setters: {
                percentage: setCurtainPercentage,
                state: setState,
            },
        },
        {
            deviceType: "THERMOSTAT",
            setters: {
                targetTemp: setTargetTemp,
                mode: setMode,
                state: setState,
            },
        },
        {
            deviceType: "HUMIDIFIER",
            setters: {
                targetTemp: setTargetHum,
                mode: setMode,
                state: setState,
            },
        },
        {
            deviceType: "AC",
            setters: {
                targetTemp: setTargetTemp,
                mode: setMode,
                windMode: setWindMode,
                state: setState,
            },
        },
        {
            deviceType: "RELAY",
            setters: {
                state: setState,
            },
        },
        {
            deviceType: "VALVE",
            setters: {
                state: setState,
            },
        },
        {
            deviceType: "FAN",
            setters: {
                state: setState,
                speed: setFanSpeed,
            },
        },
        {
            deviceType: "COMMON",
            setters: {
                state: setState,
            },
        },
        {
            deviceType: "ROBOT",
            setters: {
                state: setState,
                suctionPower: setSuctionPower,
            },
        },
    ];

    return (
        <div className={finalClassName}>
            <ItemWindow
                device={args.device}
                actionWindow
                idFunc={args.idFunc}
                setters={setters}
                setActiveDeviceId={setActiveDeviceId}
            />
        </div>
    );
};

export default ActionWindow;
