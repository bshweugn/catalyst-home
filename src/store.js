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
    initialState: {},
    reducers: {
        // Установить или изменить устройство
        setDevice: (state, action) => {
            const { id, data, status } = action.payload;
            state[id] = {
                ...data,
                favourite: state[id]?.favourite ?? false, // Добавляем favourite (по умолчанию false)
                status: status || state[id]?.status || {},
            };
        },

        // Установить значение favourite для устройства
        setFav: (state, action) => {
            const { id, favourite } = action.payload;
            if (state[id]) {
                state[id].favourite = favourite;
            }
        },

        // Удалить устройство
        removeDevice: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },

        // Обновить конкретное свойство устройства
        updateDeviceProperty: (state, action) => {
            const { id, property, value } = action.payload;
            if (state[id]) {
                state[id][property] = value;
            }
        }
    }
});

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: {},
    reducers: {
        // Добавить или обновить комнату
        setRoom: (state, action) => {
            const { id, data, status } = action.payload;
            state[id] = {
                ...data,
                order: state[id]?.order ?? (data.order || 0), // Используем скобки для предотвращения конфликта
                status: status || state[id]?.status || {},
            };
        },

        // Удалить комнату
        removeRoom: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },

        // Обновить порядок комнаты
        updateRoomOrder: (state, action) => {
            const { id, order } = action.payload;
            if (state[id]) {
                state[id].order = order;
            }
        }
    }
});

const floorsSlice = createSlice({
    name: 'floors',
    initialState: {},
    reducers: {
        // Добавить или обновить этаж
        setFloor: (state, action) => {
            const { id, data, status } = action.payload;
            state[id] = {
                ...data,
                rooms: state[id]?.rooms || [], // Сохраняем существующие комнаты
                status: status || state[id]?.status || {},
            };
        },

        // Удалить этаж
        removeFloor: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },

        // Добавить комнату в этаж
        addRoom: (state, action) => {
            const { floorId, room } = action.payload;
            if (state[floorId]) {
                state[floorId].rooms.push(room);
            }
        },

        // Удалить комнату из этажа
        removeRoom: (state, action) => {
            const { floorId, roomId } = action.payload;
            if (state[floorId]) {
                state[floorId].rooms = state[floorId].rooms.filter(r => r.id !== roomId);
            }
        }
    }
});

const housesSlice = createSlice({
    name: 'houses',
    initialState: {},
    reducers: {
        // Добавить или обновить дом
        setHouse: (state, action) => {
            const { id, data, status } = action.payload;
            state[id] = {
                ...data,
                floors: state[id]?.floors ?? [], // Сохраняем существующие этажи, если есть
                status: status || state[id]?.status || {},
            };
        },

        // Удалить дом
        removeHouse: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },

        // Добавить этаж в дом
        addFloor: (state, action) => {
            const { houseId, floor } = action.payload;
            if (state[houseId]) {
                state[houseId].floors.push(floor);
            }
        },

        // Удалить этаж из дома
        removeFloor: (state, action) => {
            const { houseId, floorId } = action.payload;
            if (state[houseId]) {
                state[houseId].floors = state[houseId].floors.filter(f => f.id !== floorId);
            }
        },

        // Добавить комнату в этаж
        addRoom: (state, action) => {
            const { houseId, floorId, room } = action.payload;
            const floor = state[houseId]?.floors.find(f => f.id === floorId);
            if (floor) {
                floor.rooms = floor.rooms ?? [];
                floor.rooms.push(room);
            }
        },

        // Удалить комнату из этажа
        removeRoom: (state, action) => {
            const { houseId, floorId, roomId } = action.payload;
            const floor = state[houseId]?.floors.find(f => f.id === floorId);
            if (floor && floor.rooms) {
                floor.rooms = floor.rooms.filter(r => r.id !== roomId);
            }
        }
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

export const { addRoom, removeRoom, changeRoomOrder } = roomsSlice.actions;
export const { addHouse, removeHouse, setUsers } = roomsSlice.actions;
export const { changeParameter } = settingsSlice.actions;
export const { setDevice, setFav, removeDevice, updateDeviceProperty } = devicesSlice.actions;

const rootReducer = combineReducers({
    devices: devicesSlice.reducer,
    rooms: roomsSlice.reducer,
    settings: settingsSlice.reducer,
    houses: housesSlice.reducer,
    glance: glanceSlice.reducer,
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
