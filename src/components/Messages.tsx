'use client'
import { cn } from "@/lib/utils";
import { getSocket } from "@/redux/socket";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { Message } from "@/types/db";



interface MessageProps {
    initialMessages: Message[];
    sessionId: string;
    sessionImg : string |null |undefined;
    chatPartner : {
        id: string,
        username:string,
        image:string,
    };
    chatId: string;

}

const Messages: FC<MessageProps> = ({
    initialMessages,
    sessionId,
    sessionImg,
    chatPartner,
    chatId
}) => {

    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const formatTimestamp = (timestamp:string) => {
        return new Date(timestamp).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true, // true for AM/PM format
        });
      };

    useEffect(() => {
        if (JSON.stringify(messages) !== JSON.stringify(initialMessages)) {
            setMessages(initialMessages);
        }
    }, [initialMessages, messages]);
    
    useEffect(()=>{
        try {
            const socket = getSocket();
            if(socket){
                socket.on('newMessage',(data)=>{
            
                    setMessages((prevMessages) => [data,...prevMessages,]);
                     // Scroll to the bottom on new message
                    scrollDownRef.current?.scrollIntoView({ behavior: 'smooth' });
                })


                return () =>{
                    socket.off('newMessage');
                }
            }
        } catch (error) {
            
        }
    },[])


    return (

        <div className="relative flex h-full">
            
            {/* Background image with overlay */}
            <div
                style={{
                backgroundImage: 'url("/images/wallapaper.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-slate-100 before:opacity-80"
            />
            
            <div  id="messages" className="relative min-h-[calc(100vh-12rem)] flex flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                <ChatInput
                    chatPartner={chatPartner}
                    sessionId={sessionId}
                    chatid={chatId}
                />
                <div ref={scrollDownRef} />
                
                {messages.map((message, index) => {
                    const isCurrentUser = message.sender === sessionId;
                    const hasNextMessageFromSender = index > 0 && messages[index - 1]?.sender === message.sender;
                    
                    return (
                        
                        <div  className="chat-message" key={`${message.sender}-${index}`}>
                            <div className={cn('flex', {
                                'justify-end': isCurrentUser,
                            })}>
                                <div 
                                    className={cn(
                                        'flex flex-col space-y-2 text-base max-w-xs mx-2',
                                        {
                                            'order-1 items-end': isCurrentUser,
                                            'order-2 items-start': !isCurrentUser,
                                        }
                                    )}
                                >
                                    <span className={cn('px-4 py-2 rounded-lg inline-block', {
                                        'bg-indigo-600 text-white': isCurrentUser,
                                        'bg-gray-200 text-gray-900': !isCurrentUser,
                                        'rounded-br-none': !hasNextMessageFromSender && isCurrentUser,
                                        'rounded-bl-none': !hasNextMessageFromSender && !isCurrentUser,
                                    })}>
                                        {message.content}{' '}
                                        <span className="ml-2 text-xs text-gray-400">
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    </span>
                                </div>
                                <div className={cn('relative w-6 h-6',{
                                    'order-2' : isCurrentUser,
                                    'order-1' : !isCurrentUser,
                                    invisible : hasNextMessageFromSender
                                })}>
                                    <Image
                                    fill
                                    src={
                                        isCurrentUser ? (sessionImg as string) : (chatPartner.image || "/images/user.png")
                                    } 
                                    alt = "profile picture"
                                    referrerPolicy = "no-referrer"
                                    className = "rounded-full"
                                    sizes="(max-width: 640px) 50px, (max-width: 768px) 60px, (max-width: 1024px) 80px, 100px" // Adjust based on your layout
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                
            </div>
            

        </div>
    );
}

export default Messages;
