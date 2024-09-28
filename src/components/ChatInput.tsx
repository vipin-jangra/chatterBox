'use client';
import { getSocket } from "../redux/socket";
import { message as antdMessage } from "antd";
import axios from "axios";
import { FC, useRef, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { IoSend } from "react-icons/io5";
import { Message } from "../types/db";


interface ChatInputProps {
    chatPartner: {
        id: string,
        username:string,
        image:string,
    };
    chatid: string;
    sessionId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatid, sessionId }) => {
    const [input, setInput] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const sendMessage = async () => {
        if (!input.trim()) return; 

        try {

            const messageData:Message = {
                sender : sessionId,
                receiver: chatPartner.id,
                content: input,
                timestamp : new Date().toString(),
            }
            
           
            const socket = getSocket();
            if (socket) {
                socket.emit('message', messageData);
            }
        
            
            await axios.post('/api/message/send', { text: input, chatId: chatid });
            
            setInput('');
            textareaRef.current?.focus();
        } catch (error) {
            antdMessage.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="relative border-t border-gray-200 bg-white sm:mb-0">
            <div className=" overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                <TextareaAutosize
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your message here"
                    className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
                />

                
                <div onClick={() => textareaRef.current?.focus()} className="py-2" aria-hidden="true">
                    <div className="py-px">
                        <div className="h-3"></div>
                    </div>
                </div>

                
                <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                    <button
                        type="button"
                        onClick={sendMessage}
                        className="inline-flex items-center justify-center p-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition duration-200 ease-in-out"
                    >
                        <IoSend className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
