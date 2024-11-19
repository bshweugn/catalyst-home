import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Для использования локального хранилища
import background from './assets/images/background.jpg';

// Создание конфигурации для persist
const persistConfig = {
    key: 'root',
    storage, // используем локальное хранилище
};

const devicesSlice = createSlice({
    name: 'devices',
    initialState: {
        id123: { id: 123, roomID: 0, favourite: false, type: 'LAMP', name: 'Главный свет', dimmable: true, dim: 100, status: 'ON', color: 3 },
        id456: { id: 456, roomID: 0, favourite: false, type: 'THERMOSTAT', name: 'Термостат', currentTemp: 25, targetTemp: 27 },
        id124: { id: 124, roomID: 0, favourite: false, type: 'LAMP', name: 'Второй свет', dimmable: false, status: 'OFF', color: 5},
        id122: { id: 122, roomID: 1, favourite: false, type: 'LAMP', name: 'Свет', dimmable: false, status: 'OFF', color: 5},
        id133: { id: 133, roomID: 1, favourite: false, type: 'LEAK_SENSOR', isSensor: true, name: 'Датчик протечки', status: 'NORMAL', color: 5 },
    },
    reducers: {
        toggleDeviceStatus: (state, action) => { 
            const device = state[action.payload.id];
            if (device.type === 'LAMP') {
                device.status = device.status === 'ON' ? 'OFF' : 'ON';
            }
        },
        setDeviceDim: (state, action) => {
            const { id, dim } = action.payload;
            state[id].dim = dim;
        },

        setDeviceColorTemp: (state, action) => {
            const { id, color } = action.payload;
            state[id].color = color;
        },

        setThermostatTemp: (state, action) => {
            const { id, temp } = action.payload;
            let dID = "id" + id;
            console.log(temp);
            state[dID].targetTemp = temp;
        },

        setFav: (state, action) => {
            const { id, favourite } = action.payload;
            let dID = "id" + id;
            state[dID].favourite = favourite;
        }
    }
});

const camerasSlice = createSlice({
    name: 'cameras',
    initialState: {
        id123: { id: 123, name: "Кухня", roomID: 2, favourite: true, xDeg: 90, yDeg: 45, isRecording: true, delay: 2 },
        id456: { id: 456, name: "Гостиная", roomID: 0, favourite: false, xDeg: null, yDeg: null, isRecording: false, delay: 4 },
        id124: { id: 124, name: "Улица", roomID: 4, favourite: false, xDeg: 0, yDeg: 0, isRecording: true, delay: 2 },
    },

    reducers: {
        toggleRecording: (state, action) => { 
            const device = state[action.payload.id];
            device.isRecording = device.isRecording === 'ON' ? 'OFF' : 'ON';
        },

        setXDeg: (state, action) => {
            const { id, xDeg } = action.payload;
            state[id].xDeg = xDeg;
        },

        setYDeg: (state, action) => {
            const { id, yDeg } = action.payload;
            state[id].yDeg = yDeg;
        },

        setCamFav: (state, action) => {
            const { id, favourite } = action.payload;
            let dID = "id" + id;
            state[dID].favourite = favourite;
        }
    }
});

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: {
        id0: { id: 0, order: 0, name: 'Гостиная' },
        id1: { id: 1, order: 1, name: 'Ванная' },
        id2: { id: 2, order: 2, name: 'Кухня' },
        id3: { id: 3, order: 3, name: 'Гараж' },
        id4: { id: 4, order: 4, name: 'Улица' },
        id5: { id: 5, order: 5, name: 'Спальня' },
    },
    reducers: {
        addRoom: (state, action) => {
            const { id, name } = action.payload;
            let rID = "id" + id;
            state[rID] = { id, name };
        },
        removeRoom: (state, action) => {
            const { id } = action.payload;
            let rID = "id" + id;
            delete state[rID];
        },
        changeRoomOrder: (state, action) => {
            const { newOrder } = action.payload;
            newOrder.forEach((room, index) => {
                const rID = "id" + room.id;
                state[rID].order = index;
            });
        },
    }
});

const glanceSlice = createSlice({
    name: 'glance',
    initialState: {
        temp: { visible: true, data: [456]},
        air: {visible: true, data: []},
    },
    reducers: {
        changeGlanceVisibility: (state, action) => {
            const { name, visible } = action.payload;
            state[name].visible = visible;
        },

        changeGlanceData: (state, action) => {
            const { name, visible } = action.payload;
            state[name].visible = visible;
        },
    }
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        haptics: { enabled: true },
        holdMode: { enabled: true },
        background: { image: background },
        maximizedCards: { id: [] }
    },
    reducers: {
        changeParameter: (state, action) => {
            const { name, parameter, value } = action.payload;
            state[name][parameter] = value; // Обновляем параметр
        }
    }
});

export const { toggleDeviceStatus, setDeviceDim, setThermostatTemp, setFav } = devicesSlice.actions;
export const { addRoom, removeRoom, changeRoomOrder } = roomsSlice.actions;
export const { changeParameter } = settingsSlice.actions;
export const { toggleRecording, setXDeg, setYDeg, setCamFav } = camerasSlice.actions;

const rootReducer = combineReducers({
    devices: devicesSlice.reducer,
    rooms: roomsSlice.reducer,
    settings: settingsSlice.reducer,
    glance: glanceSlice.reducer,
    cameras: camerasSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export default store;
