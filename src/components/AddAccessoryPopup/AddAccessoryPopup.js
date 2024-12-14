import React, { useEffect, useState } from 'react';
import './AddAccessoryPopup.scss';
import Popup from '../Popup/Popup';
import ScannerPreview from '../ScannerPreview/ScannerPreview';
import Button from '../Button/Button';
import IconWithHint from '../IconWithHint/IconWithHint';
import QR from '../icons/QR/QR';
import TextInput from '../TextInput/TextInput';
import Lightbulb from '../icons/Lightbulb/Lightbulb';
import Room from '../icons/Room/Room';

import background from '../../assets/images/background.jpg';
import background1 from '../../assets/images/background1.jpg';
import background2 from '../../assets/images/background2.jpg';
import background3 from '../../assets/images/background3.jpeg';
import background4 from '../../assets/images/background4.JPG';
import background5 from '../../assets/images/background5.JPG';
import background6 from '../../assets/images/background6.JPG';
import background7 from '../../assets/images/background7.JPG';
import background8 from '../../assets/images/background8.JPG';
import background9 from '../../assets/images/background9.JPG';
import BackgroundSelector from '../BackgroundSelector/BackgroundSelector';
import Stairs from '../icons/Stairs/Stairs';
import House from '../icons/House/House';
import Description from '../Description/Description';
import User from '../icons/User/User';
import NewUser from '../icons/NewUser/NewUser';
import ToggleList from '../ToggleList/ToggleList';
import ItemsList from '../ItemsList/ItemsList';
import { useSelector } from 'react-redux';
import ItemsShortPreview from '../ItemsShortPreview/ItemsShortPreview';
import VisibilityWrapper from '../VisiilityWrapper/VisiilityWrapper';
import { renderItemIcon, renderItemName } from '../../itemInfo';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import EnvelopePerson from '../icons/EnvelopePerson/EnvelopePerson';

import avatar from '../../assets/images/user.jpeg';
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import Play from '../icons/Play/Play';
import CurrentTrigger from '../CurrentTrigger/CurrentTrigger';
import Select from '../Select/Select';
import ConditionWindow from '../ConditionWindow/ConditionWindow';
import { checkDevice } from '../../logic/devices';

const AddAccessoryPopup = (args) => {
    const [view, setView] = useState("default");

    const devices = useSelector(state => state.devices);
    const cameras = useSelector(state => state.cameras);
    const rooms = useSelector(state => state.rooms);

    const [room, setRoom] = useState(rooms["id0"]);

    const [fullscreenRequired, setFullscreenRequired] = useState(false);

    const [manualInput, setManualInput] = useState(false);
    const [code, setCode] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [roomId, setRoomId] = useState(-1);
    const [device, setDevice] = useState(null);

    const [inputValue, setInputValue] = useState("");
    const [pageBackground, setPageBackground] = useState(background);

    const [deviceSelectMode, setDeviceSelectMode] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(-1);

    const [shouldAnimate, setSholudAnimate] = useState(false);

    const [toggleStates, setToggleStates] = useState([
        { label: 'Гостевой доступ', value: false, setter: (value) => handleToggleChange(0, value) },
    ]);

    const handleToggleChange = (index, value) => {
        const newToggles = [...toggleStates];
        newToggles[index].value = value;
        setToggleStates(newToggles);
    };


    const handleClose = () => {
        setView("default");
        setManualInput(false);
        setDeviceSelectMode(false);
        createTrigger(-1, '', '')
        handleToggleChange(0, false);
        args.func(false);
        setTimeout(() => setFullscreenRequired(false), 400);
    };


    useEffect(() => {
        setView(args.view);
        setTimeout(() => console.log(view + " WWW " + args.view), 100);
    }, [args.view]);

    const animate = () => {
        setSholudAnimate(true);
        setTimeout(() => setSholudAnimate(false), 400);
    };

    const getDevice = async () => {
        try {
            const device = await checkDevice(args.token, code);
            setDevice(device);
            console.log(device);
            setView('device');
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
            setDevice('Ошибка.');
        }
    }

    const importDevice = async () => {
        try {
            const device = await importDevice(args.token, code, deviceName, roomId);
            setDevice(device);
            console.log(device);
            setView('device');
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
            setDevice('Ошибка.');
        }
    }


    const [deviceID, setDeviceID] = useState(-1);
    const [parameter, setParameter] = useState("");
    const [condition, setCondition] = useState("");

    const [trigger, setTrigger] = useState({
        id: -1,
        device: null,
        action: "",
        parameter: ""
    });


    const createTrigger = (ID, device, condition, parameter) => {
        setTrigger(
            {
                id: ID,
                device: device,
                condition: condition,
                parameter: parameter
            }
        )
    }


    const handleConditionChange = (id, device, condition, parameter) => {
        setCondition(condition);
        createTrigger(selectedDevice, devices["id" + selectedDevice], condition, parameter);
    }


    const renderConditionContent = (device) => {
        if (device.type == "LEAK_SENSOR") {
            return (
                <>
                    <Select light options={["Обнаружение протечки"]} actualOptions={["LEAK_DETECTED"]} setSelectedOption={handleConditionChange} selectedOption={condition} />
                </>
            )
        }
    }


    useEffect(() => {
        console.log(trigger);
        setCondition(trigger.condition)
        // console.log(trigger.id, trigger.id != -1, trigger.action, trigger.action !== "", devices["id" + selectedDevice], devices["id" + selectedDevice].isSensor)
        // if(trigger.id && trigger.id != -1 && trigger.action !== "" && devices["id" + selectedDevice]){
        //     if()
        // }
    }, [trigger]);

    const renderAccessoryContent = () => {
        return manualInput ? (
            <div>
                <input
                    className="add-accessory-popup__code-input"
                    type="text"
                    placeholder=""
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <div className="button-group">
                    <Button primary onClick={() => { getDevice(); animate() }} label="Далее" />
                    <Button onClick={() => { setManualInput(false); animate() }} label="Использовать камеру" />
                </div>
            </div>
        ) : (
            <>
                <ScannerPreview active={args.visible} />
                <IconWithHint
                    icon={QR}
                    title="Отсканируйте код настройки"
                    label="Код может располагаться на устройстве, упаковке или документации."
                />
                <div className="button-group">
                    <Button onClick={() => { setManualInput(true); animate() }} label="Ввести код вручную" />
                    {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                </div>
            </>
        );
    };

    useEffect(() => {
        if (view === "default" || view === "accessory" || view === "invite-sent") {
            setFullscreenRequired(false);
        } else if (view === "home" || view === "level" || view === "room" || view === "user" || view === "device" || view === "automation") {
            setFullscreenRequired(true);
        }
    }, [view]);

    const renderContent = () => {
        switch (view) {
            case "default":
                return (
                    <>
                        <div className="button-group">
                            <div className='add-accessory-popup__cards-wrapper'>
                                <div className='add-accessory-popup__card' onClick={() => { setView("accessory"); animate() }}>
                                    <Lightbulb className="add-accessory-popup__card-icon" size="2rem" fill="black" />
                                    <p className='add-accessory-popup__card-name'>Аксессуар</p>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("room"); animate() }}>
                                    <Room className="add-accessory-popup__card-icon" size="1.8rem" fill="black" />
                                    <p className='add-accessory-popup__card-name'>Комната</p>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("level"); animate() }}>
                                    <Stairs className="add-accessory-popup__card-icon" size="2.05rem" fill="black" />
                                    <p className='add-accessory-popup__card-name'>Этаж</p>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("automation"); animate() }}>
                                    <Play className="add-accessory-popup__card-icon" size="2rem" fill="black" />
                                    <p className='add-accessory-popup__card-name'>Автомати-<br />зация</p>
                                </div>
                            </div>
                            <div className='add-accessory-popup__card add-accessory-popup__card--wide' onClick={() => { setView("user"); animate() }}>
                                <div className='add-accessory-popup__avatar' style={{ backgroundImage: `url(${avatar})` }} />
                                <User className="add-accessory-popup__card-icon" size="2rem" fill="black" />
                                <p className='add-accessory-popup__card-name'>Житель или гость</p>
                            </div>
                            <Button onClick={() => { setView("home"); animate() }} label="Создать новый Дом" />
                        </div>
                    </>
                );
            case "accessory":
                return renderAccessoryContent();
            case "room":
                return (
                    <>
                        <TextInput light separated value={inputValue} setValue={setInputValue} placeholder={'Например, «Гостиная»'} label={"Имя комнаты"} />
                        <Description text="Вы сможете изменить имя позднее в параметрах комнаты." />
                        <BackgroundSelector light background={pageBackground} setBackground={setPageBackground} label="Фоновое&nbsp;изображение" images={[background, background1, background2, background3, background4, background5, background6, background7, background8, background9]} />
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary className={"add-accessory-popup__primary-button"} label="Добавить" onClick={() => console.log("Комната сохранена:", inputValue)} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                            <Button label="" />
                        </div>
                    </>
                );
            case "home":
                return (
                    <>
                        <TextInput light separated value={inputValue} setValue={setInputValue} placeholder={'Например, «Мой Дом»'} label={"Имя дома"} />
                        <Description text="Вы сможете изменить имя позднее в параметрах Дома." />
                        <BackgroundSelector light background={pageBackground} setBackground={setPageBackground} label="Фоновое&nbsp;изображение" images={[background, background1, background2, background3, background4, background5, background6, background7, background8, background9]} />
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary className={"add-accessory-popup__primary-button"} label="Сохранить" onClick={() => console.log("Комната сохранена:", inputValue)} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                            <Button label="" />
                        </div>
                    </>
                );
            case "level":
                return (
                    <>
                        <TextInput light separated value={inputValue} setValue={setInputValue} placeholder={'Например, «Главный»'} label={"Имя этажа"} />
                        <Description text="Вы сможете изменить имя позднее в параметрах Дома." />
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary label="Сохранить" onClick={() => console.log("Этаж сохранён:", inputValue)} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                            <Button label="" />
                        </div>
                    </>
                );
            case "device":
                return (
                    <>
                        {renderItemIcon(device, true, "3.5rem")}
                        <p className='add-accessory-popup__item-name'>{renderItemName(device)}</p>
                        <p className='add-accessory-popup__item-manufacturer'>{device.manufacturer}</p>
                        <TextInput light value={inputValue} setValue={setInputValue} placeholder={' '} label={"Имя аксессуара"} />
                        <Description bottomSeparated text="Вы сможете изменить имя и расположение позднее в параметрах аксессуара." />
                        <DropdownSelect
                            light
                            options={Object.keys(rooms)}
                            selectedOption={Object.room}
                            setSelectedOption={setRoom}
                            label="Комната"
                        />
                        {/* <Description text="Вы сможете переместить аксессуар в другую комнату позднее в его параметрах." /> */}
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary label="Сохранить" onClick={() => console.log("Этаж сохранён:", inputValue)} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                            <Button label="" />
                        </div>
                    </>
                );
            case "invite-sent":
                return (
                    <>
                        <EnvelopePerson fill="rgb(2, 123, 255)" size="4rem" className='add-accessory-popup__main-icon' />
                        <p className='add-accessory-popup__title'>Приглашение отправлено</p>
                        <p className='add-accessory-popup__text add-accessory-popup__text--bottom-separated'>Если пользователь примет приглашение, то сможет управлять и просматривать информацию о Доме и устройствах в нём.</p>
                        {/* <Description text="Вы сможете переместить аксессуар в другую комнату позднее в его параметрах." /> */}
                        <div className="add-accessory-popup__buttons-group">
                            <Button primary label="Готово" onClick={() => handleClose()} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                        </div>
                    </>
                );
            case "user": {
                if (!deviceSelectMode) {
                    return (
                        <>
                            <NewUser className="add-accessory-popup__big-icon" size="4rem" fill="#027bff" />
                            <TextInput
                                light
                                value={inputValue}
                                setValue={setInputValue}
                                placeholder={'Например, «mail@catalyst.com»'}
                                label={"Электронная почта"}
                            />
                            <Description sticked text="Укажите адрес электронной почты пользователя для отправки запроса на общий доступ." />
                            <ToggleList separated light toggles={toggleStates} label="Параметры доступа" />
                            <Description text="В гостевом режиме пользователю будет предоставлен доступ только к&nbsp;выбранным Вами устройствам." />
                            <VisibilityWrapper defaultState={true} visible={toggleStates[0].value}>
                                <ItemsShortPreview label={"Выбор аксессуаров"} devices={devices} action={() => { setDeviceSelectMode(true); animate() }} />
                            </VisibilityWrapper>
                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Поделиться" onClick={() => { setView('invite-sent'); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                            </div>
                        </>
                    );
                } else {
                    return (
                        <>
                            {Object.keys(rooms)
                                .sort((a, b) => rooms[a].order - rooms[b].order)
                                .map(roomId => {
                                    const roomDevices = Object.keys(devices)
                                        .filter(deviceId => devices[deviceId].roomID === rooms[roomId].id)
                                        .map(deviceId => devices[deviceId]);

                                    if (roomDevices.length === 0) return null;

                                    return (
                                        <ItemsList
                                            light
                                            preview
                                            multipleSelection={true}
                                            setter={setSelectedDevices}
                                            selected={selectedDevices}
                                            key={roomId}
                                            roomName={rooms[roomId].name}
                                            roomID={rooms[roomId].id}
                                            devices={roomDevices}
                                        />
                                    );
                                })}
                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Сохранить" onClick={() => { setDeviceSelectMode(false); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                            </div>
                        </>
                    );
                }
            }
            case "automation": {
                if (!deviceSelectMode) {
                    return (
                        <>
                            <CurrentTrigger trigger={trigger} addFunc={() => { setDeviceSelectMode(true); animate() }} />
                            <Description text="Сценарий будет запущени при соблюдении выбранного условия активации." />
                            {/* <ToggleList separated light toggles={toggleStates} label="Параметры доступа" />
                            <VisibilityWrapper defaultState={true} visible={!toggleStates[0].value}>
                                <ItemsShortPreview label={"Выбор аксессуаров"} devices={devices} action={() => { setDeviceSelectMode(true); animate() }} />
                            </VisibilityWrapper> */}
                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Поделиться" onClick={() => { setView('invite-sent'); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                            </div>
                        </>
                    );
                } else {
                    return (
                        <>
                            {Object.keys(rooms)
                                .sort((a, b) => rooms[a].order - rooms[b].order)
                                .map(roomId => {
                                    const roomDevices = Object.keys(devices)
                                        .filter(deviceId =>
                                            devices[deviceId].roomID === rooms[roomId].id &&
                                            devices[deviceId].isSensor === true
                                        )
                                        .map(deviceId => devices[deviceId]);

                                    if (roomDevices.length === 0) return null;

                                    return (
                                        <ItemsList
                                            light
                                            preview
                                            openedID={selectedDevice}
                                            key={roomId}
                                            setItemID={setSelectedDevice}
                                            roomName={rooms[roomId].name}
                                            roomID={rooms[roomId].id}
                                            devices={roomDevices}
                                            conditionWindow={renderConditionContent}
                                            setCondition={setCondition}
                                            atomicSelected={trigger.id}
                                            canSave={trigger.id && trigger.id != -1 && trigger.action !== "" && devices["id" + selectedDevice]}
                                        />
                                    );
                                })}

                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Готово" onClick={() => { setDeviceSelectMode(false); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                            </div>
                        </>
                    );
                }
            }
            default:
                return null;
        }
    };

    return (
        <Popup
            animation={shouldAnimate}
            fullscreen={fullscreenRequired}
            className={`add-accessory-popup ${args.className || ''}`}
            visible={args.visible}
            func={handleClose}
            title={
                view === "default" ? "Добавить в Дом" :
                    view === "accessory" ? "Добавить аксессуар" :
                        view === "room" ? "Добавить комнату" :
                            view === "level" ? "Добавить этаж" :
                                view === "user" ? "Поделиться доступом" :
                                    view === "device" ? "" :
                                        view === "automation" ? "Создать автоматизацию" :
                                            view === "invite-sent" ? "" :
                                                "Создать новый Дом"
            }
            label={
                view === "default" ? "" :
                    view === "accessory" ? manualInput ? "Введите шестизначный код, указанный на устройстве, упаковке или документации." : "Отсканируйте код на аксессуаре для добавления в Ваш дом." :
                        view === "room" ? "Задайте имя и фон для новой комнаты." :
                            view === "level" ? "Задайте имя для нового этажа." :
                                view === "user" ? deviceSelectMode ? "Выберите аксессуары, доступ к которым Вы хотите предоставить." : "Поделитесь доступом к управлению Домом c другим пользователем." :
                                    view === "device" ? "" :
                                        view === "automation" ? deviceSelectMode ? "Выберите устройство для добавления условия активации сценария." : "Настройте автоматизацию для взаимодействия между устройствами." :
                                            view === "invite-sent" ? "" :
                                                "Задайте имя и фон для нового Дома."
            }
        >
            {renderContent()}
        </Popup>
    );
};

export default AddAccessoryPopup;
