import {configureStore} from '@reduxjs/toolkit'
import notificationsReducer from './notificationsSlice';

const store = configureStore({
    reducer: {
        notifications : notificationsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;