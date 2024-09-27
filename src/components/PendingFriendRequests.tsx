'use client'

import axios from "axios";
import { FC, useEffect, useState } from "react";
import { IoCheckmarkOutline, IoChevronBack } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { getSocket } from "@/redux/socket";
import Image from "next/image";

interface IncomingFriendRequests {
    _id: string;
    email: string;
    username: string;
    image?: string; // Ensure username is included
}

interface PendingFriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequests[]
}

const PendingFriendRequests: FC<PendingFriendRequestsProps> = ({ incomingFriendRequests }) => {
    const router = useRouter();
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequests[]>(incomingFriendRequests);

    useEffect(() => {
        const socket = getSocket();

        if (socket) {
            const handleNewFriendRequest = ({ sender }: { sender: { sender: string, email: string, username: string, image:string } }) => {
                const newRequest: IncomingFriendRequests = {
                    _id: sender.sender,
                    email: sender.email,
                    username: sender.username ,
                    image: sender.image,
                };
                setFriendRequests((prevFriendRequests) => [...prevFriendRequests, newRequest]);
            }

            socket.on('friendRequestNotification', handleNewFriendRequest);

            return () => {
                socket.off('friendRequestNotification', handleNewFriendRequest);
            }
        }
    }, []);

    const acceptFriend = async (senderId: string) => {
        const resp = await axios.post('/api/friends/accept', { id: senderId });
        
        if (resp.data.success) {
            setFriendRequests((prev) => prev.filter((request) => request._id !== senderId));
            message.success(resp.data.msg);
            router.refresh();
        } else {
            message.error(resp.data.msg);
        }
    }

    const rejectFriend = async (senderId: string) => {
        const response = await axios.post('/api/friends/reject', { id: senderId });
        if (response.data.success) {
            setFriendRequests((prev) => prev.filter((request) => request._id !== senderId));
            message.success(response.data.msg);
            router.refresh();
        } else {
            message.error(response.data.msg);
        }
    }

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg w-full">
            <div className="flex flex-col w-full gap-4 bg-white p-5">
                <div className="flex">
                    <button onClick={handleBack} className="flex items-center ml-2 mr-4 focus:outline-none">
                        <IoChevronBack className="text-2xl text-gray-700" />
                    </button>
                    <h2 className="justify-center font-semibold text-gray-700">Pending Requests</h2>
                </div>
                
            </div>



            <div className="flex flex-col bg-white w-full p-5 gap-2">
                {friendRequests.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center">Nothing to show here...</p>
                ) : (
                    <div className="space-y-4">
                        {friendRequests.map((request) => (
                            <div key={request._id} className="flex items-center justify-between p-4 border hover:bg-slate-50 rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        src={request?.image || "/images/user.png"}
                                        alt={`${request.username || 'user'} profile picture`}
                                        className="rounded-full"
                                    />
                                </div>
                                    <div className="flex flex-col">
                                        <p className="font-medium text-lg">{request.username}</p>
                                        <p className="text-slate-500 text-sm">{request.email}</p>
                                    
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => acceptFriend(request._id)} 
                                        aria-label="Accept friend" 
                                        className="w-8 h-8 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition transform hover:scale-110 shadow-md"
                                    >
                                        <IoCheckmarkOutline className="text-white w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => rejectFriend(request._id)} 
                                        aria-label="Reject friend" 
                                        className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition transform hover:scale-110 shadow-md"
                                    >
                                        <IoIosClose className="text-white w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default PendingFriendRequests;
