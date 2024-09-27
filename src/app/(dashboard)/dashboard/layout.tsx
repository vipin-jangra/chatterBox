import Link from "next/link";
import { ReactNode } from "react";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { notFound } from "next/navigation";

import User from "@/models/userModel";
import dbConnect from "@/lib/dbConfig";

import { IoAddCircleOutline, IoChatbubbleEllipses } from "react-icons/io5";

import { BsSend } from "react-icons/bs";
import SideBarChatList from "@/components/SideBarChatsList";
import FriendRequestsSidebarOptions from "@/components/FriendRequestsSidebarOptions";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import { IconBaseProps } from "react-icons/lib";

interface LayoutProps {
    children: ReactNode
}


// interface friends {
//     _id: string;
//     username : string;
//     image : string;
//     friends: Types.ObjectId[];
//   }
  

interface SidebarOptions {
    id: number,
    name: string,
    href: string,
    Icon: React.ComponentType<IconBaseProps>,
}



const sidebarOptions: SidebarOptions[] = [
    {
        id: 1,
        name: "Add friend",
        href: "/dashboard/add",
        Icon: IoAddCircleOutline,
    }
];

const Layout = async ({ children }: LayoutProps) => {
    await dbConnect();
    const session:Session | null = await getServerSession(authOptions);
    if (!session) notFound();


    async function getFriendsByUserId(userId: string){
        const user = await User.findById({ _id: userId }).select('friends')

        if(!user){
            return [];
        }

        const friendsIds = user.friends || [];

        const friendsDetails = await User.find({
            _id: { $in: friendsIds }
        });

        return friendsDetails;
    }

    const friends = await getFriendsByUserId(session.user?.id) ?? [];
    const user = await User.findById(session.user!.id).select('friendRequests');
    const friendRequests = user?.friendRequests || [];
    const unseenRequestCount = friendRequests.length;

    return (
        <div className="flex h-screen w-full">
            <div className="hidden md:flex h-full w-full max-w-xs flex-col gap-y-5 overflow-y-auto border-r border-e-gray-200 bg-white px-6">
                <Link href='/dashboard' className="flex h-16 shrink-0 items-center">
                    <BsSend className="text-3xl text-zinc-500 mt-1 " />
                    <div className="text-left font-bold text-green-500 text-2xl">
                        Chatter<span className="text-blue-300">Box</span>
                    </div>
                </Link>

                {friends.length > 0 ? (
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                        Your Chats
                    </div>
                ) : null}

                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <SideBarChatList sessionId={session.user?.id} friends={friends} />
                        </li>
                        <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                                Overview
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {sidebarOptions.map((option) => {
                                    return (
                                        <li key={option.id}>
                                            <Link href={option.href}
                                                className="text-gray-700 hover:text-indigo-500 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm font-semibold">
                                                <span>
                                                    <option.Icon className="h-6 w-6" /> 
                                                </span>
                                                <span className="truncate">{option.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>
                                    <FriendRequestsSidebarOptions initialUnseenRequestCount={unseenRequestCount} />
                                </li>
                            </ul>
                        </li>

                        <li className="-mx-6 mt-auto flex items-center">
                            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="relative h-8 w-8 bg-gray-50 ">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        src={session.user!.image || '/images/user.png'}
                                        alt="Your profile picture"
                                        sizes="(max-width: 640px) 50px, (max-width: 768px) 60px, (max-width: 1024px) 80px, 100px"
                                    />
                                </div>

                                <span className="sr-only">Your profile</span>
                                <div className="flex flex-col">
                                    <span aria-hidden='true'>{session.user!.name}</span>
                                    <span className="text-xs text-zinc-400" aria-hidden='true'>
                                        {session.user!.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton className="h-full max-w-11 w-full aspect-square flex items-center justify-center hover:bg-slate-100" />
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-grow">
                {children}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
                <nav className="flex">
                    <ul className="flex w-full justify-between  gap-2 px-3">
                        <li className="flex items-center justify-center hover:bg-gray-50 min-w-20 ">
                            <Link href="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-indigo-500 ">
                                <IoChatbubbleEllipses className="h-6 w-6" />
                                <span className="text-xs">Chats</span>
                            </Link>
                            
                        </li>
                        <li className="flex items-center justify-center hover:bg-gray-50 min-w-20 ">
                            <Link href="/dashboard/add" className="flex flex-col items-center text-gray-600 hover:text-indigo-500">
                                <IoAddCircleOutline className="h-6 w-6" />
                                <span className="text-xs">Add Friend</span>
                            </Link>
                        </li>
                        <li className="flex">
                            <FriendRequestsSidebarOptions initialUnseenRequestCount={unseenRequestCount} />
                        </li>
                        <li className="flex items-center hover:bg-gray-50 justify-around min-w-28 ">
                            <div className="relative h-8 w-8 bg-gray-50 ">
                                <Image
                                    fill
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                    src={session.user!.image || '/images/user.png'}
                                    alt="Your profile picture"
                                    sizes="(max-width: 640px) 50px, (max-width: 768px) 60px, (max-width: 1024px) 80px, 100px"
                                />
                                </div>
                            <SignOutButton className="h-full r-0 max-w-12 w-full aspect-square flex items-center justify-center hover:bg-slate-100" />

                        </li>
                    </ul>
                    
                </nav>
            </div>
            
        </div>
    )
}

export default Layout;
