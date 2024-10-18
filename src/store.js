import { configureStore, createSlice } from '@reduxjs/toolkit';

const devicesSlice = createSlice({
    name: 'devices',
    initialState: {
        id123: { id: 123, roomID: 0, type: 'LAMP', name: 'Главный свет', dimmable: true, dim: 100, status: 'ON', color: 3 },
        id456: { id: 456, roomID: 0, type: 'THERMOSTAT', name: 'Термостат', currentTemp: 25, targetTemp: 27 },
        id124: { id: 124, roomID: 0, type: 'LAMP', name: 'Второй свет', dimmable: false, status: 'OFF', color: 5},
        id122: { id: 122, roomID: 1, type: 'LAMP', name: 'Свет', dimmable: false, status: 'OFF', color: 5},
        id133: { id: 133, roomID: 1, type: 'LEAK_SENSOR', isSensor: true, name: 'Датчик протечки', status: 'NORMAL', color: 5 },
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
        }
    }
});

const roomsSlice = createSlice({
    name: 'rooms',
    initialState: {
        id0: { id: 0, order: 0, name: 'Гостиная' },
        id1: { id: 1, order: 1, name: 'Ванная' },
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
            delete state[action.payload.rID];
        },
        changeRoomOrder: (state, action) => {
            const { newOrder } = action.payload;
            let rID;
            newOrder.forEach((room, index) => {
                rID= "id" + room.id;
                state[rID].order = room.order;
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

export const { toggleDeviceStatus, setDeviceDim, setThermostatTemp } = devicesSlice.actions;
export const { addRoom, removeRoom, changeRoomOrder } = roomsSlice.actions;

const store = configureStore({
    reducer: {
        devices: devicesSlice.reducer,
        rooms: roomsSlice.reducer,
    }
});

export default store;
