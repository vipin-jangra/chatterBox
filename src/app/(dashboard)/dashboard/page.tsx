
import { authOptions } from "../../api/auth/[...nextauth]/options";
import MobileDash from "../../../components/MobileDash";
import dbConnect from "../../../lib/dbConfig";
import User from "../../../models/userModel";
import { Session } from "next-auth";
import { notFound } from "next/navigation";
import { BsSend } from "react-icons/bs";
import { getServerSession } from "next-auth/next";

const page = async() => {
  await dbConnect();
    const session:Session | null = await getServerSession(authOptions);
    if (!session) notFound();

    async function getFriendsByUserId(userId: string) {
        const user = await User.findById({ _id: userId }).select('friends')

        if(!user){
            return [];
        }

        const friendsIds = user.friends;

        const friendsDetails = await User.find({
            _id: { $in: friendsIds }
        });

        return friendsDetails;
    }

    const friends = await getFriendsByUserId(session.user!.id) ?? [];

  return (
    <div className="relative flex flex-col h-full w-full">
      <div className="hidden md:flex relative flex-col h-full w-full bg-slate-100 justify-center items-center font-serif">
        
        <div
          style={{
            backgroundImage: 'url("/images/wallapaper.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="hidden md:flex absolute inset-0 z-0 before:absolute before:inset-0 before:bg-slate-100 before:opacity-80"
        />

        {/* Content */}
        <div className=" hidden md:flex relative  items-center z-10 flex-col mb-5 ">
          <div className="flex ">
            <BsSend className="text-5xl text-zinc-500 mt-1 " />
            <div className="text-left font-bold text-green-500 text-5xl ">
              Chatter<span className="text-blue-300">Box</span>
            </div>
          </div>
          <div className="relative text-center z-10 flex flex-col text-3xl sm:text-4xl md:text-5xl font-serif text-gray-400 ">
            <span> Welcome to ChatterBox! </span>
            <div className="max-w-md text-lg">
                  manage conversations, connect with friends,{`\n`}
                  and dive into real-time chats, all in one place!
            </div>
          </div>
        </div>

      </div>

        <div className="flex flex-col md:hidden bg-white w-full">
            <MobileDash sessionId={session.user?.id} friends={friends} />

        </div>
    </div>
  );
};

export default page;
