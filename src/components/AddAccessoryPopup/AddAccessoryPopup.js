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
import { useDispatch, useSelector } from 'react-redux';
import ItemsShortPreview from '../ItemsShortPreview/ItemsShortPreview';
import VisibilityWrapper from '../VisiilityWrapper/VisiilityWrapper';
import { isSensor, renderItemIcon, renderItemName } from '../../itemInfo';
import DropdownSelect from '../DropdownSelect/DropdownSelect';
import EnvelopePerson from '../icons/EnvelopePerson/EnvelopePerson';

import avatar from '../../assets/images/user.jpeg';
import ProfileInfo from '../ProfileInfo/ProfileInfo';
import Play from '../icons/Play/Play';
import CurrentTrigger from '../CurrentTrigger/CurrentTrigger';
import Select from '../Select/Select';
import ConditionWindow from '../ConditionWindow/ConditionWindow';
import { addDevice, checkDevice, getDeviceById, getDevicesByIdsInRooms } from '../../services/devicesService';
import { createFloor, createRoom, fetchHousesData, getRoomsAndDevicesByHouseId, getRoomsByHouseId } from '../../services/housesService';
import Warn from '../icons/Warn/Warn';
import { error } from '@splidejs/splide/src/js/utils';
import ScriptDevicesList from '../ScriptDevicesList/ScriptDevicesList';
import ScriptActionsList from '../ScriptActionsList/ScriptActionsList';
import { IonSpinner } from '@ionic/react';
import ActionWindow from '../ActionWindow/ActionWindow';
import PlusIcon from '../icons/PlusIcon/PlusIcon';

const AddAccessoryPopup = (args) => {
    const dispatch = useDispatch();

    const [view, setView] = useState("default");

    const devices = useSelector(state => state.devices);
    // const cameras = useSelector(state => state.cameras);
    // const rooms = useSelector(state => state.rooms);

    const [currentRoom, setCurrentRoom] = useState();

    const [fullscreenRequired, setFullscreenRequired] = useState(false);

    const [manualInput, setManualInput] = useState(false);
    const [roomId, setRoomId] = useState(-1);
    const [device, setDevice] = useState(null);

    const [conditionValue, setConditionValue] = useState('');
    const [scriptRight, setScriptRight] = useState("");
    const [scriptLeft, setScriptLeft] = useState("");

    const [inputValue, setInputValue] = useState("");
    const [pageBackground, setPageBackground] = useState(background);

    const [deviceSelectMode, setDeviceSelectMode] = useState(false);
    const [scriptDeviceSelectMode, setScriptDeviceSelectMode] = useState(false);
    const [selectedDevicesIds, setSelectedDevicesIds] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(-1);

    const [shouldAnimate, setSholudAnimate] = useState(false);

    const [toggleStates, setToggleStates] = useState([
        { label: 'Гостевой доступ', value: false, setter: (value) => handleToggleChange(0, value) },
    ]);


    useEffect(() => {
        setSelectedDevices(getDevicesByIdsInRooms(selectedDevicesIds, args.rooms));
    }, [selectedDevicesIds]);

    const handleToggleChange = (index, value) => {
        const newToggles = [...toggleStates];
        newToggles[index].value = value;
        setToggleStates(newToggles);
    };


    const handleClose = () => {
        setView("default");
        setManualInput(false);
        setDeviceSelectMode(false);
        setScriptDeviceSelectMode(false);
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


    /* --- ВЗАИМОДЕЙСТВИЕ С ДОМОМ --- */

    const [code, setCode] = useState("");

    const [newRoomName, setNewRoomName] = useState("");
    const [newFloorName, setNewFloorName] = useState("");
    const [newDeviceName, setNewDeviceName] = useState("");
    const [newDeviceNameInvisible, setNewDeviceNameInvisible] = useState("");




    const fetchData = async () => {
        try {
            const data = await fetchHousesData(args.token);
            if (data) {
                args.setHouses(data);

                const roomsData = getRoomsByHouseId(args.currentHouseID, data);
                args.setRooms(roomsData);
                console.log(roomsData);
                return data;
            } else {
                console.warn("Данные не были получены");
            }
        } catch (error) {
            console.error("Ошибка загрузки домов:", error);
        }
    };

    const getDevice = async () => {
        try {
            setView('device-checking')
            const device = await checkDevice(dispatch, args.token, code);

            if (device !== null) {
                setDevice(device);
                setNewDeviceNameInvisible(renderItemName(device))
                console.log(device);
                animate();
                setView('device');
            } else {
                console.warn('Устройство не найдено или структура ответа некорректна:', device);
                animate();
                setView('unknown-device');
            }
        } catch (error) {
            console.error('Ошибка при получении устройства:', error);
            animate();
            setView('unknown-device');
        }
    };



    const importDevice = async () => {
        try {
            let deviceName = "";
            if (newDeviceName === "") {
                deviceName = newDeviceNameInvisible;
            } else {
                deviceName = newDeviceName;
            }

            animate();
            setView('device-importing');
            const result = await addDevice(dispatch, args.token, { serialNumber: code, name: deviceName, roomId: currentRoom.id });
            console.log(result);
            if (result) {
                const result = fetchData(args.token);
                if (result) setTimeout(() => handleClose(), 400);
            }
        } catch (error) {
            animate();
            setView('error');
            console.error('Ошибка при получении устройства:', error);
        }
    }

    const handleRoomCreate = async () => {
        try {
            animate();
            setView('room-creating');
            const room = await createRoom(dispatch, args.token, newRoomName, 1);
            console.log(room);
            if (room) {
                const result = fetchData(args.token);
                if (result) setTimeout(() => handleClose(), 400);
            }
        } catch (error) {
            animate();
            setView('error');
            console.error('Ошибка при получении устройства:', error);
        }
    }


    const handleFloorCreate = async () => {
        try {
            const floor = await createFloor(dispatch, args.token, newFloorName, args.currentHouseID);
            console.log(floor);
            if (floor) {
                const result = fetchData(args.token);
                if (result) setTimeout(() => handleClose(), 400);
            }
        } catch (error) {
            animate();
            setView('error');
            console.error('Ошибка при получении устройства:', error);
        }
    }


    const handleInviteSent = (id, device, condition, parameter) => {
        setView('invite-sent');
        setSelectedDevicesIds([]);
    }

    /* ------------- */


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
        createTrigger(selectedDevice, devices[selectedDevice], condition, parameter);
    }

    const handleSetConditionValue = (value) => {
        setConditionValue(value);
        createTrigger(selectedDevice, devices[selectedDevice], condition, value);
    }


    const renderConditionContent = (device) => {
        const [mainType, subType] = device.deviceType.split('_');


        if (mainType == "LEAK") {
            return (
                <>
                    <Select light options={["Обнаружение протечки"]} actualOptions={["LEAK_DETECTED"]} setSelectedOption={handleConditionChange} selectedOption={condition} />
                </>
            )
        }

        if (mainType == "TEMPERATURE") {
            return (
                <>
                    <Select light options={["Температура равна", "Температура ниже", "Температура выше"]} actualOptions={["TEMP_EQUALS", "TEMP_LOWER_THAN", "TEMP_HIGHER_THAN"]} setSelectedOption={handleConditionChange} selectedOption={condition} inputValue={conditionValue} setInputValue={handleSetConditionValue} placeholder=" " append={"°C"} />
                </>
            )
        }
    }

    useEffect(() => {
        console.log(selectedDevice);
    }, [selectedDevice]);

    useEffect(() => {
        if (trigger && trigger.device) {
            console.log(trigger);
            setCondition(trigger.condition);
            setScriptLeft(`[${trigger.device.id}, "${trigger.condition}", "${trigger.parameter}"] -> `);
        }
    }, [trigger]);


    const actions = []

    const renderAccessoryContent = () => {
        return manualInput ? (
            <div>
                <input
                    className="add-accessory-popup__code-input"
                    type="text"
                    placeholder=""
                    value={code}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^\d{0,6}$/.test(inputValue)) {
                            setCode(inputValue);
                        }
                    }}
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
        if (view === "default" || view === "accessory" || view === "invite-sent" || view === "unknown-accessory" || view === "device-checking" || view === "error") {
            setFullscreenRequired(false);
        } else if (view === "home" || view === "level" || view === "room" || view === "user" || view === "device" || view === "automation" || view === "device-importing" || view === "room-creating") {
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
                                    <Lightbulb className="add-accessory-popup__card-icon" size="2.25rem" fill="black" />
                                    <div className='add-accessory-popup__card-pair'>
                                        <p className='add-accessory-popup__card-name'>Аксессуар</p>
                                        <p className='add-accessory-popup__card-label'>Отсканировать либо ввести код</p>
                                    </div>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("room"); animate() }}>
                                    <Room className="add-accessory-popup__card-icon" size="2rem" fill="black" />
                                    <div className='add-accessory-popup__card-pair'>
                                        <p className='add-accessory-popup__card-name'>Этаж или комната</p>
                                        <p className='add-accessory-popup__card-label'>Удобная группировка аксессуаров</p>
                                    </div>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("automation"); animate() }}>
                                    <Play className="add-accessory-popup__card-icon" size="2.25rem" fill="black" />
                                    <div className='add-accessory-popup__card-pair'>
                                        <p className='add-accessory-popup__card-name'>Автоматизация</p>
                                        <p className='add-accessory-popup__card-label'>Автоматическое выполнение сценариев</p>
                                    </div>
                                </div>
                                <div className='add-accessory-popup__card' onClick={() => { setView("user"); animate() }}>
                                    <div className='add-accessory-popup__circle-compensation'>
                                        <div className='add-accessory-popup__avatar' style={{ backgroundImage: `url(${avatar})` }} />
                                        <div className="add-accessory-popup__card-plus-circle" >
                                            <PlusIcon lassName="add-accessory-popup__card-plus-icon" size="0.6875rem" fill="black" />
                                        </div>
                                    </div>
                                    <div className='add-accessory-popup__card-pair'>
                                        <p className='add-accessory-popup__card-name'>Пользователь</p>
                                        <p className='add-accessory-popup__card-label'>Полный, гостевой доступ</p>
                                    </div>
                                </div>
                            </div>
                            {/* <Button onClick={() => { setView("home"); animate() }} label="Создать новый Дом" /> */}
                        </div>
                    </>
                );
            case "accessory":
                return renderAccessoryContent();
            case "room":
                return (
                    <>
                        <TextInput light separated value={newRoomName} setValue={setNewRoomName} placeholder={'Например, «Гостиная»'} label={"Имя комнаты"} />
                        <Description text="Вы сможете изменить имя позднее в параметрах комнаты." />
                        <BackgroundSelector light background={pageBackground} setBackground={setPageBackground} label="Фоновое&nbsp;изображение" images={[background, background1, background2, background3, background4, background5, background6, background7, background8, background9]} />
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary className={"add-accessory-popup__primary-button"} label="Добавить" onClick={() => handleRoomCreate()} />
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
                        <TextInput light separated value={newFloorName} setValue={setNewFloorName} placeholder={'Например, «Главный»'} label={"Имя этажа"} />
                        <Description text="Вы сможете изменить имя позднее в параметрах Дома." />
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary label="Сохранить" onClick={() => handleFloorCreate()} />
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
                        <TextInput light value={newDeviceName} setValue={setNewDeviceName} placeholder={' '} label={"Имя аксессуара"} />
                        <Description bottomSeparated text="Вы сможете изменить имя и расположение позднее в параметрах аксессуара." />
                        {/* <p>{JSON.stringify(args.rooms)}</p> */}
                        <DropdownSelect
                            light
                            options={args.rooms.map(room => ({ id: room.id, name: room.name }))}
                            selectedOption={currentRoom?.id || null}
                            setSelectedOption={(roomId) => {
                                const selectedRoom = args.rooms.find(room => room.id === roomId);
                                setCurrentRoom(selectedRoom);
                            }}
                            label="Комната"
                        />
                        {/* <Description text="Вы сможете переместить аксессуар в другую комнату позднее в его параметрах." /> */}
                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                            <Button primary label="Сохранить" onClick={() => importDevice()} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                            <Button label="" />
                        </div>
                    </>
                );
            case "device-checking":
                return (
                    <>
                        <div className='add-accessory-popup__spinner-wrapper'>
                            <IonSpinner className={"add-accessory-popup__spinner"}></IonSpinner>
                        </div>
                    </>
                );
            case "device-importing":
                return (
                    <>
                        <div className='add-accessory-popup__spinner-wrapper'>
                            <IonSpinner className={"add-accessory-popup__spinner"}></IonSpinner>
                        </div>
                    </>
                );
            case "room-creating":
                return (
                    <>
                        <div className='add-accessory-popup__spinner-wrapper'>
                            <IonSpinner className={"add-accessory-popup__spinner"}></IonSpinner>
                        </div>
                    </>
                );
            case "invite-sent":
                return (
                    <>
                        <EnvelopePerson fill="rgb(2, 123, 255)" size="4.2rem" className='add-accessory-popup__main-icon' />
                        <p className='add-accessory-popup__title'>Приглашение отправлено</p>
                        <p className='add-accessory-popup__text add-accessory-popup__text--bottom-separated'>Если пользователь примет приглашение, то сможет управлять и просматривать информацию о Доме и устройствах в нём.</p>
                        <div className="add-accessory-popup__buttons-group">
                            <Button primary label="Готово" onClick={() => handleClose()} />
                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                        </div>
                    </>
                );
            case "unknown-device":
                return (
                    <>
                        <Warn fill="rgb(170, 170, 170)" size="3.6rem" className='add-accessory-popup__main-icon' />
                        <p className='add-accessory-popup__title'>Неизвестное устройство</p>
                        <p className='add-accessory-popup__text add-accessory-popup__text--bottom-separated'>Кажется, Вы ввели некорректный код или аксессуар больше недоступен для добавления.</p>
                        <div className="add-accessory-popup__buttons-group">
                            <Button primary label="Готово" onClick={() => handleClose()} />
                            <Button onClick={() => { setView("accessory"); animate() }} label="Добавить заново" />
                        </div>
                    </>
                );
            case "error":
                return (
                    <>
                        <Warn fill="rgb(170, 170, 170)" size="3.6rem" className='add-accessory-popup__main-icon' />
                        <p className='add-accessory-popup__title'>Ошибка добавления</p>
                        <p className='add-accessory-popup__text add-accessory-popup__text--bottom-separated'>При добавлении объекта в Ваш Дом произошла ошибка. Пожалуйста, повторите попытку позднее.</p>
                        <div className="add-accessory-popup__buttons-group">
                            <Button primary label="Готово" onClick={() => handleClose()} />
                            <Button onClick={() => { setView("default"); animate() }} label="Добавить заново" />
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
                                <ItemsShortPreview label={"Выбор аксессуаров"} devices={selectedDevices} action={() => { setDeviceSelectMode(true); animate() }} />
                            </VisibilityWrapper>
                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Поделиться" onClick={() => { handleInviteSent(); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                                <div className='add-accessory-popup__buttons-group-tint' />

                            </div>
                        </>
                    );
                } else {
                    return (
                        <>
                            {
                                Object.values(args.rooms).map((room) => (
                                    <ItemsList
                                        light
                                        preview
                                        multipleSelection={true}
                                        setter={setSelectedDevicesIds}
                                        selected={selectedDevicesIds}

                                        key={room.id}
                                        roomName={room.name}
                                        roomID={room.id}
                                        devices={room.devices}
                                    />
                                ))
                            }
                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Сохранить" onClick={() => { setDeviceSelectMode(false); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                                <div className='add-accessory-popup__buttons-group-tint' />
                            </div>
                        </>
                    );
                }
            }
            case "automation": {
                if (!deviceSelectMode) {
                    if (!scriptDeviceSelectMode) {
                        return (
                            <>
                                <CurrentTrigger trigger={trigger} addFunc={() => { setDeviceSelectMode(true); animate() }} />
                                <Description text="Сценарий будет запущен при соблюдении выбранного условия активации." />
                                <ScriptActionsList actions={actions} openDevicesList={() => { setScriptDeviceSelectMode(true); animate() }} houses={args.houses} actionsString={scriptRight} />
                                {/* <ToggleList separated light toggles={toggleStates} label="Параметры доступа" />
                            <VisibilityWrapper defaultState={true} visible={!toggleStates[0].value}>
                                <ItemsShortPreview label={"Выбор аксессуаров"} devices={devices} action={() => { setDeviceSelectMode(true); animate() }} />
                            </VisibilityWrapper> */}
                                <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                    <Button primary label="Готово" onClick={() => { console.log(scriptLeft + scriptRight) }} />
                                    {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                    <Button label="" />
                                    <div className='add-accessory-popup__buttons-group-tint' />
                                </div>
                            </>
                        );
                    } else {
                        return (
                            <>
                                {selectedDevice <= 0 ?
                                    <>
                                        <div className='add-accessory-popup__scrollable-list'>
                                            <div className='add-accessory-popup__scrollable-list-tint' />
                                            {Object.values(args.rooms).map((room) => {
                                                const filteredDevices = room.devices.filter(
                                                    (device) => !isSensor(device)
                                                );

                                                if (filteredDevices.length === 0) return null;

                                                return (
                                                    <ItemsList
                                                        light
                                                        preview
                                                        openedID={selectedDevice}
                                                        setItemID={setSelectedDevice}
                                                        key={room.id}
                                                        roomName={room.name}
                                                        roomID={room.id}
                                                        devices={filteredDevices}
                                                        conditionWindow={renderConditionContent}
                                                        setCondition={setCondition}
                                                        atomicSelected={trigger.id}
                                                        canSave={
                                                            devices[selectedDevice]
                                                        }
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                            <Button primary label="Готово" onClick={() => { setScriptDeviceSelectMode(false); animate() }} />
                                            {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                            <Button label="" />
                                            <div className='add-accessory-popup__buttons-group-tint' />
                                        </div>
                                    </>
                                    : <ActionWindow device={getDeviceById(selectedDevice, args.houses)} idFunc={setSelectedDevice} setString={setScriptRight} string={scriptRight} />}
                            </>
                        );
                    }
                } else {
                    return (
                        <>
                            {Object.values(args.rooms).map((room) => {
                                const filteredDevices = room.devices.filter(
                                    (device) => isSensor(device)
                                );

                                if (filteredDevices.length === 0) return null;

                                return (
                                    <ItemsList
                                        light
                                        preview
                                        openedID={selectedDevice}
                                        setItemID={setSelectedDevice}
                                        key={room.id}
                                        roomName={room.name}
                                        roomID={room.id}
                                        devices={filteredDevices}
                                        conditionWindow={renderConditionContent}
                                        setCondition={setCondition}
                                        atomicSelected={trigger.id}
                                        canSave={
                                            trigger.id &&
                                            trigger.id !== -1 &&
                                            trigger.action !== "" &&
                                            devices[selectedDevice]
                                        }
                                    />
                                );
                            })}


                            <div className="add-accessory-popup__buttons-group add-accessory-popup__buttons-group--bottom">
                                <Button primary label="Готово" onClick={() => { setDeviceSelectMode(false); animate() }} />
                                {/* <Button onClick={() => setView("default")} label="Назад" /> */}
                                <Button label="" />
                                <div className='add-accessory-popup__buttons-group-tint' />
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
                            view === "room-creating" ? "Добавление комнаты" :
                                view === "level" ? "Добавить этаж" :
                                    view === "user" ? "Поделиться доступом" :
                                        view === "device" ? "" :
                                            view === "device-checking" ? "Проверка аксессуара" :
                                                view === "device-importing" ? "Добавление аксессуара" :
                                                    view === "automation" ? "Создать автоматизацию" :
                                                        view === "invite-sent" || view === "unknown-device" || view === "error" ? "" :
                                                            "Создать новый Дом"
            }
            label={
                view === "default" ? "" :
                    view === "accessory" ? manualInput ? "Введите шестизначный код, указанный на устройстве, упаковке или документации." : "Отсканируйте код на аксессуаре для добавления в Ваш дом." :
                        view === "room" ? "Задайте имя и фон для новой комнаты." :
                            view === "room-creating" ? "Комната добавляется в Ваш дом." :
                                view === "level" ? "Задайте имя для нового этажа." :
                                    view === "user" ? deviceSelectMode ? "Выберите аксессуары, доступ к которым Вы хотите предоставить." : "Поделитесь доступом к управлению Домом c другим пользователем." :
                                        view === "device" ? "" :
                                            view === "device-checking" ? "Это не займёт много времени." :
                                                view === "device-importing" ? "Аксессуар добавляется в Ваш дом." :
                                                    view === "automation" ? deviceSelectMode ? "Выберите устройство для добавления условия активации сценария." : "Настройте автоматизацию для взаимодействия между устройствами." :
                                                        view === "invite-sent" || view === "unknown-device" || view === "error" ? "" :
                                                            "Задайте имя и фон для нового Дома."
            }
        >
            {renderContent()}
        </Popup>
    );
};

export default AddAccessoryPopup;
