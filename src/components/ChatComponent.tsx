"use client"; // Mark this component as client-side
import { useState, useEffect } from "react";
import Messages from "../components/Messages";
import Image from "next/image";
import { useSelector } from "react-redux";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { RootState } from "../redux/store";
import { Message } from '../types/db';
import ChatInput from "./ChatInput";

interface ChatComponentProps {
    chatPartner: {
        id: string,
        username:string,
        image:string,
    }; // Allow chatPartner to be null
    tempMessages: Omit<Message,"id" | "receiver">[];
    sessionUser: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    chatId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatPartner, tempMessages, sessionUser, chatId }) => {

    const [isClient, setIsClient] = useState(false);
    const onlineUsers = useSelector((state: RootState) => state.notifications.onlineUsers) as string[];

    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleBack = () => {
        router.back();
    };

    // Safely check if chatPartner is online
    const isOnline = chatPartner ? onlineUsers.includes(chatPartner.id) : false; 

    if (!chatPartner) {
        return <div>No chat found.</div>; // Handle the case when chatPartner is null
    }

    return (
        <div className="relative justify-between flex flex-col h-full pb-16 md:pb-0 ">
            <div className=" flex sm:items-center py-3 border-b-2 border-gray-200">
                <button onClick={handleBack} className="flex items-center ml-2 mr-4 focus:outline-none">
                    <IoChevronBack className="text-2xl text-gray-700" />
                </button>
                <div className="relative flex items-center ">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image
                                fill
                                referrerPolicy="no-referrer"
                                src={chatPartner?.image || "/images/user.png"}
                                alt={`${chatPartner.username || 'user'} profile picture`}
                                className="rounded-full"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        {isClient && isOnline && (
                            <div className="bg-green-500 p-1 absolute rounded-full bottom-2 -right-1"></div>
                        )}
                    </div>
                    <div className="ml-2 flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-700 mr-3 font-semibold">
                                {chatPartner.username}
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            {isClient ? (
                                isOnline ? <span>online</span> : <span>offline</span>
                            ) : (
                                <span>offline</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Messages
                chatPartner={chatPartner}
                initialMessages={tempMessages}
                sessionId={sessionUser.id}
                sessionImg={sessionUser.image}
                chatId={chatId}
            />

            <ChatInput
                    chatPartner={chatPartner}
                    sessionId={sessionUser.id}
                    chatid={chatId}
                />
        </div>
    );
};

export default ChatComponent;
