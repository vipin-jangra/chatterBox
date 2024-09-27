import { authOptions } from "../../../api/auth/[...nextauth]/options";
import PendingFriendRequests from "../../../../components/PendingFriendRequests";
import dbConnect from "../../../../lib/dbConfig";
import User from "../../../../models/userModel";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

interface PendingUser {
    _id: string;
    email: string;
    username: string;
    image?: string; // Optional in case not all users have an image
}


const page = async () => {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    await dbConnect();

    
    const user = await User.findById(session.user.id).select('friendRequests');

    let pendingRequests:PendingUser[] =[];

    if (user && user.friendRequests && user.friendRequests.length > 0) {

        const friendRequestIds = user.friendRequests ?? [];

        pendingRequests = await User.find({
            _id: { $in: friendRequestIds }
        }).select('_id email username image')
   }

    return (
        <div className="relative flex flex-col h-full w-full bg-slate-100 ">
            <div
                style={{
                    backgroundImage: 'url("/images/wallapaper.jpeg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-slate-100 before:opacity-80"
            />

            <div className="relative z-10 w-full flex p-3">
                {/* <div className="w-11/12 md:w-8/12 lg:w-6/12 min-h-96 bg-white rounded-lg shadow-xl"> */}
                    
                <PendingFriendRequests incomingFriendRequests={pendingRequests} />
                    
                
            </div>
        </div>
    );
};

export default page;
