'use client'

import { getSocket } from "@/redux/socket";
import { message } from "antd";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";

interface FriendRequestsSidebarOptionsProps {
    initialUnseenRequestCount:number
}

const FriendRequestsSidebarOptions: FC<FriendRequestsSidebarOptionsProps> = ({initialUnseenRequestCount})=>{
    
    const [unseenRequestCount,setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

    useEffect(() => {
        const socket = getSocket();
        
        if (socket) {
            // Listen for incoming friend request notifications
            const handleFriendRequestNotification = (notification: { senderId: string; message: string }) => {
                message.info(`${notification.message}`);
                
                // Update unseen friend requests count
                setUnseenRequestCount((prevCount) => prevCount + 1);

            };

            // Listen to the socket event
            socket.on('friendRequestNotification', handleFriendRequestNotification);

            // Clean up the event listener on component unmount
            return () => {
                socket.off('friendRequestNotification', handleFriendRequestNotification);
            };
        }
    }, []);



    return (
        <Link href='/dashboard/requests'
            className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
            
            <div className="flex relative flex-col md:flex-row md:gap-2   items-center text-center w-max">
                <IoPersonAdd className="h-6 w-6" />
                <span className="text-xs md:font-semibold">Pending Requests</span>
                {unseenRequestCount >0 ? 
                (<div className="md:hidden absolute right-0  rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
                    {unseenRequestCount}
                </div>) : null    
        }
            </div>
            {unseenRequestCount >0 ? 
                (<div className="hidden md:flex rounded-full w-5 h-5 text-xs justify-center items-center text-white bg-indigo-600">
                    {unseenRequestCount}
                </div>) : null    
        }
        </Link>
    )
}

export default FriendRequestsSidebarOptions;