"use client";

import { addFriendValidator } from "../lib/validations/add-friend";
import { message } from "antd";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { getSocket } from "../redux/socket";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AxiosError } from 'axios';

interface AddFriendButtonProps {}
interface User {
    _id: string;
    email: string;
    username: string;
    image: string;
    requestSent: 'accepted' | 'requested' | 'none';
}

const AddFriendButton: FC<AddFriendButtonProps> = () => {
    const [data, setData] = useState({ email: "" });
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searching, setSearching] = useState<boolean>(false); // For search loading

    const addFriend = async (email: string) => {
        setLoading(true);
        try {
            addFriendValidator.parse({ email });
            const response = await axios.post("/api/friends/add", { email });

            if (response.data.success) {
                message.success(response.data.msg);
                const socket = getSocket();
                if (socket) {
                    socket.emit("sendFriendRequest", response.data.data);
                }
            } else {
                message.error(response.data.msg);
            }

            setData({ email: "" });
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const searchFriend = async () => {
        try {
            const { email } = data;
            if (email) {
                setSearching(true); // Set searching to true while searching
                const response = await axios.post("/api/friends/search", { query: email });

                if (response.data.success) {
                    setUsers(response.data.data);
                } else {
                    message.error(response.data.msg);
                }
            } else {
                setUsers([]);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                const errorMessage = error.response.data?.msg || "An error occurred while searching.";
                message.error(errorMessage);
            } else {
                message.error("An unexpected error occurred.");
            }
        } finally {
            setSearching(false); // Done searching
        }
    };

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchTimeout(
            setTimeout(() => {
                searchFriend();
            }, 1000)
        );

        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    },[data.email]);

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
                    <h2 className="justify-center font-semibold text-gray-700">Find Friends</h2>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        className="block w-full max-w-80 rounded-3xl pl-5 border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                        placeholder="search by username or you@example.com"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="flex flex-col bg-white w-full p-5 gap-2">
                {searching ? (
                    <div>Searching...</div>
                ) : users.length === 0 ? (
                    data.email ? <div>No friends found</div> : <div>Start typing to search friends...</div>
                ) : (
                    users.map((user) => (
                        <div key={user._id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                            <div className="flex gap-2 items-center">
                                <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        src={user?.image || "/images/user.png"}
                                        alt={`${user.username || 'user'} profile picture`}
                                        className="rounded-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">{user.username}</h3>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                {user.requestSent === "requested" ? (
                                    <button
                                        className="px-4 py-2 text-gray-500 bg-gray-200 rounded-full cursor-not-allowed"
                                        disabled
                                    >
                                        Requested
                                    </button>
                                ) : user.requestSent === "none" ? (
                                    <button
                                        onClick={() => addFriend(user.email)}
                                        className={`px-4 py-2 text-white rounded-full transition-colors duration-300 ${
                                            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        Add Friend
                                    </button>
                                ) : (
                                    <button className="px-4 py-2 text-white bg-green-600 rounded-full">Friends</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddFriendButton;
