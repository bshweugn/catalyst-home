import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const devicesSlice = createSlice({
    name: 'devices',
    initialState: {},
    reducers: {
        setDevice: (state, action) => {
            const { id, data } = action.payload;
            state[id] = {
                ...data,
                favourite: state[id]?.favourite ?? false,
            };
        },
        setFav: (state, action) => {
            const { id, favourite } = action.payload;
            if (state[id]) state[id].favourite = favourite;
        },
        removeDevice: (state, action) => {
            const { id } = action.payload;
            delete state[id];
        },

        updateDeviceProperty: (state, action) => {
            const { id, property, value } = action.payload;
            if (state[id]) {
                state[id][property] = value;
            }
        },
    },
});

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: {},
    reducers: {
        setRoom: (state, action) => {
            const { id, data } = action.payload;
            state[id] = {
                ...data,
                devices: state[id]?.devices || [],
            };
        },
        addDeviceToRoom: (state, action) => {
            const { roomId, device } = action.payload;
            if (state[roomId]) state[roomId].devices.push(device);
        },
        removeDeviceFromRoom: (state, action) => {
            const { roomId, deviceId } = action.payload;
            if (state[roomId]) {
                state[roomId].devices = state[roomId].devices.filter(d => d.id !== deviceId);
            }
        },
    },
});

const floorsSlice = createSlice({
    name: 'floors',
    initialState: {},
    reducers: {
        setFloor: (state, action) => {
            const { id, data } = action.payload;
            state[id] = {
                ...data,
                rooms: state[id]?.rooms || [],
            };
        },
        addRoomToFloor: (state, action) => {
            const { floorId, room } = action.payload;
            if (state[floorId]) state[floorId].rooms.push(room);
        },
        removeRoomFromFloor: (state, action) => {
            const { floorId, roomId } = action.payload;
            if (state[floorId]) {
                state[floorId].rooms = state[floorId].rooms.filter(r => r.id !== roomId);
            }
        },
    },
});

const housesSlice = createSlice({
    name: 'houses',
    initialState: {},
    reducers: {
        setHouse: (state, action) => {
            const { id, data } = action.payload;
            state[id] = {
                ...data,
                floors: state[id]?.floors || [],
            };
        },
        addFloorToHouse: (state, action) => {
            const { houseId, floor } = action.payload;
            if (state[houseId]) state[houseId].floors.push(floor);
        },
        removeFloorFromHouse: (state, action) => {
            const { houseId, floorId } = action.payload;
            if (state[houseId]) {
                state[houseId].floors = state[houseId].floors.filter(f => f.id !== floorId);
            }
        },
    },
});

// Экспортируем экшены
export const {
    setDevice,
    setFav,
    removeDevice,
    updateDeviceProperty,
} = devicesSlice.actions;

export const {
    setRoom,
    addDeviceToRoom,
    removeDeviceFromRoom,
} = roomsSlice.actions;

export const {
    setFloor,
    addRoomToFloor,
    removeRoomFromFloor,
} = floorsSlice.actions;

export const {
    setHouse,
    addFloorToHouse,
    removeFloorFromHouse,
} = housesSlice.actions;

const rootReducer = combineReducers({
    devices: devicesSlice.reducer,
    rooms: roomsSlice.reducer,
    floors: floorsSlice.reducer,
    houses: housesSlice.reducer,
});

const persistConfig = {
    key: 'root',
    storage,
};

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




export const selectRoomsWithDevicesByHouseId = (state, houseId) => {
    const house = state.houses[houseId];


    if (!house) {
        return []
    } else {
        console.log(house);
    };

    const roomsWithDevices = [];


    house.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
            roomsWithDevices.push({
                roomId: room.id,
                roomName: room.name,
                devices: room.devices ?? [],
            });
        });
    });

    return roomsWithDevices;
};




export default store;
