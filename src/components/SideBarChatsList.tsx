'use client';

import { ChatHrefConstructor } from '../lib/utils';
import { setOnlineUsers } from '../redux/notificationsSlice';
import { getSocket, initializeeSocket } from '../redux/socket';
import store, { RootState } from '../redux/store';
import { Friends } from '../types/IncomingFriendRequests';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


interface SideBarChatListProps {
  friends: Friends[];
  sessionId: string;
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {
  const dispatch = useDispatch();
  const onlineUsers = useSelector((state: RootState) => state?.notifications?.onlineUsers);

  useEffect(() => {
    let socket = getSocket();
    if (!socket) {
      initializeeSocket(store, sessionId);
      socket = getSocket(); 
    }

    if (sessionId && socket) {
      socket.on('onlineUser', (data) => {
        dispatch(setOnlineUsers(data));
      });
    }

    return () => {
      if (socket) {
        socket.off('onlineUser');
        socket.off('friendRequestNotification');
      }
    };
  }, [sessionId, dispatch]);

  return (
    <ul role="list" className="overflow-y-auto -mx-2 space-y-1">
      {friends
        .sort((a, b) => a.username.localeCompare(b.username)) // Sorting friends by username
        .map((friend) => (
          <li key={friend._id}>
            <Link
              href={`/dashboard/chat/${ChatHrefConstructor(sessionId, friend._id)}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-medium p-3 text-sm leading-6 font-semibold"
            >
              <div className="relative flex items-center space-x-4">
                <div className="relative w-8 sm:w-8 h-8 sm:h-8">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    src={friend.image || '/images/default-user.png'} // Default profile picture
                    alt={`${friend.username || 'user'} profile picture`}
                    className="rounded-full"
                    sizes="(max-width: 640px) 50px, (max-width: 768px) 60px, (max-width: 1024px) 80px, 100px" // Adjust based on your layout
                  />
                </div>
                {onlineUsers.includes(friend._id) && (
                  <div className="bg-green-500 p-1 absolute rounded-full bottom-2 -right-1"></div>
                )}
              </div>
              {friend.username}
            </Link>
            <div className="flex border w-full text-slate-50"></div>
          </li>
        ))}
    </ul>
  );
};

export default SideBarChatList;
