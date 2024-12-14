import { configureStore, createSlice, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import background from './assets/images/background.jpg';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage,
};

const devicesSlice = createSlice({
    name: 'devices',
    initialState: {
        id123: { id: 123, roomID: 0, favourite: false, homeView: true, type: 'LAMP', name: 'Главный свет', dimmable: true, dim: 100, status: 'ON', color: 3 },
        id456: { id: 456, roomID: 0, favourite: false, homeView: true, type: 'THERMOSTAT', name: 'Термостат', currentTemp: 25, targetTemp: 27 },
        id124: { id: 124, roomID: 0, favourite: false, homeView: true, type: 'LAMP', name: 'Второй свет', dimmable: false, status: 'OFF', color: 5 },
        id122: { id: 122, roomID: 1, favourite: false, homeView: true, type: 'LAMP', name: 'Свет', dimmable: false, status: 'OFF', color: 5 },
        id133: { id: 133, roomID: 1, favourite: false, homeView: true, type: 'LEAK_SENSOR', isSensor: true, name: 'Датчик протечки', status: 'ALERT', color: 5 },
        id153: { id: 153, roomID: 1, favourite: false, homeView: true, false: 'VALVE', name: 'Клапан', status: 'OPENED', battery_percentage: 85 },
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
        
            // Проверяем, существует ли объект с ключом dID
            if (state[dID]) {
                state[dID].favourite = favourite;
            }
            // Если объекта нет, просто ничего не делаем
        },

        setHomeView: (state, action) => {
            const { id, homeView } = action.payload;
            let dID = "id" + id;
            state[dID].homeView = homeView;
        }
    }
});

const camerasSlice = createSlice({
    name: 'cameras',
    initialState: {
        id123: { id: 123, name: "Кухня", roomID: 2, favourite: true, xDeg: 90, yDeg: 45, isRecording: true, delay: 2 },
        id456: { id: 456, name: "Гостиная", roomID: 0, favourite: false, xDeg: null, yDeg: null, isRecording: false, delay: 4 },
        id124: { id: 124, name: "Гараж", roomID: 4, favourite: false, xDeg: 0, yDeg: 0, isRecording: true, delay: 2 },
        id125: { id: 125, name: "Задний двор", roomID: 4, favourite: false, xDeg: 0, yDeg: 0, isRecording: true, delay: 2 },
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

const housesSlice = createSlice({
    name: 'houses',
    initialState: {
        id0: { id: 0, name: 'Гостиная', users: [0, 1, 2] },
        id1: { id: 1, name: 'Ванная', users: [0] },
    },
    reducers: {
        addHouse: (state, action) => {
            const { id, name } = action.payload;
            let rID = "id" + id;
            state[rID] = { id, name };
        },
        removeRoom: (state, action) => {
            const { id } = action.payload;
            let rID = "id" + id;
            delete state[rID];
        },

        setUsers: (state, action) => {
            const { id, users } = action.payload;
            let rID = "id" + id;
            state[rID].users = users;
        },
    }
});

const glanceSlice = createSlice({
    name: 'glance',
    initialState: {
        temp: { visible: true, data: [456] },
        air: { visible: true, data: [] },
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
            state[name][parameter] = value;
        }
    }
});

export const { toggleDeviceStatus, setDeviceDim, setThermostatTemp, setFav, setHomeView } = devicesSlice.actions;
export const { addRoom, removeRoom, changeRoomOrder } = roomsSlice.actions;
export const { addHouse, removeHouse, setUsers } = roomsSlice.actions;
export const { changeParameter } = settingsSlice.actions;
export const { toggleRecording, setXDeg, setYDeg, setCamFav } = camerasSlice.actions;

const rootReducer = combineReducers({
    devices: devicesSlice.reducer,
    rooms: roomsSlice.reducer,
    settings: settingsSlice.reducer,
    houses: housesSlice.reducer,
    glance: glanceSlice.reducer,
    cameras: camerasSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export default store;
