import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConfig';
import Chats from '@/models/chat';
import User from '@/models/userModel';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import ChatComponent from '@/components/ChatComponent';
import { getServerSession } from 'next-auth/next';
import { Chat } from '@/types/db';
import { Session } from 'next-auth';

interface PageProps {
  params: {
    chatId: string;
  };
}

// Define User type for clarity
interface UserType {
  _id: mongoose.Types.ObjectId; // or string, depending on your setup
  username: string;
  image: string;
}

async function getChatMessage(chatId: string) {
  try {
    const chat:Chat | null = await Chats.findOne({ chatId: chatId });
    if (!chat) return null;

    const messages = Array.isArray(chat.messages)
      ? chat.messages
      : [];


    return messages.map((msg)=>{
        return {
            sender: msg.sender.toString(),
            content : msg.content,
            timestamp: msg.timestamp.toString(),
        }
    }).reverse();
    
  } catch (error) {
    console.error(error);
    return null;
  }
}

const page = async ({ params }: PageProps) => {
  await dbConnect();

  const { chatId } = params;
  const session: Session | null = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  if (!user || !user.id) {
    notFound();
  }

  const [stringUserId1, stringUserId2] = chatId.split('--');

  const userId1 = new mongoose.Types.ObjectId(stringUserId1);
  const userId2 = new mongoose.Types.ObjectId(stringUserId2);

  if (!userId1.equals(user.id) && !userId2.equals(user.id)) {
    notFound();
  }

  const chatPartnerId = user.id === userId1.toString() ? userId2 : userId1;
  const chatPartnerData = await User.findOne({ _id: chatPartnerId }).select('username image _id').lean() as UserType | null;;

  // Check if chatPartnerData is null
  if (!chatPartnerData) {
    notFound();
  }

  const chatPartner = {
    id: chatPartnerData._id.toString(),
    username: chatPartnerData.username,
    image: chatPartnerData.image,
  };
  const initialMessages = (await getChatMessage(chatId)) || [];

  return (
    <ChatComponent
      chatPartner={chatPartner}
      tempMessages={initialMessages}
      sessionUser={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      chatId={chatId}
    />
  );
};

export default page;
