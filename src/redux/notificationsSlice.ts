import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
    notifications: string[];
    onlineUsers: string[];
    userData: string[]; // You might want to specify the type for better clarity
}

const initialState: NotificationState = {
    notifications: [],
    onlineUsers: [],
    userData: [],
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotifications: (state, action: PayloadAction<string>) => {
            state.notifications.push(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
        setUserData: (state, action: PayloadAction<string[]>) => {
            state.userData = action.payload;
        },
        logout: (state) => {
            state.userData = [];
            state.notifications = []; // Optionally clear notifications on logout
            state.onlineUsers = []; // Optionally clear online users on logout
        }
    }
});

export const {
    setUserData,
    logout,
    addNotifications,
    clearNotifications,
    setOnlineUsers,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
