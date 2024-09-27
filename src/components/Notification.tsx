import { RootState } from "../redux/store"; // Ensure correct import path
import { message } from "antd";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearNotifications } from "../redux/notificationsSlice"; // Ensure correct import

const Notification = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.notifications.notifications); // Access the notifications array

    useEffect(() => {
        if (notifications.length > 0) {
            notifications.forEach((notification) => {
                message.info(notification); // Display each notification
            });
            // Clear notifications after displaying them
            dispatch(clearNotifications());
        }
    }, [notifications, dispatch]);

    return null; // No UI to render
}

export default Notification;
