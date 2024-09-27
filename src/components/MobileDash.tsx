'use client'
import { BsSend } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import SideBarChatList from "./SideBarChatsList";
import { FC, useState } from "react";

import { Friends } from "@/types/IncomingFriendRequests";


interface MobileDashProps {
    sessionId: string;
    friends :Friends[];
}

const MobileDash:FC<MobileDashProps> = ({sessionId,friends})=>{

    // State to handle search input
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Filter friends based on the search term
    const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return(
        <>
            <div className="w-full relative p-5 h-full">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="flex font-semibold text-slate-600 text-xl">
                  Chats
                </div>
                <div className="flex ">
                  <BsSend className="text-2xl text-zinc-500 mt-1 " />
                  <div className="text-left font-bold text-green-500 text-2xl ">
                    Chatter<span className="text-blue-300">Box</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input className="flex relative border-none w-full rounded-lg px-5 bg-slate-100 focus:border-none text-slate-700 text-sm focus:ring-0"
                 placeholder="Search here..."
                 type="search"
                 onChange={(e)=>{setSearchTerm(e.target.value)}}
                  />
                <IoSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-700" />
              </div>
            </div>
          </div>
        
          <div className="w-full relative p-5">
            <ul role="list" className="flex h-full flex-1 flex-col gap-y-7">
                <li>
                  <SideBarChatList sessionId={sessionId} friends={filteredFriends} />
                </li>
            </ul>
          </div>
        </>
    )

}

export default MobileDash;