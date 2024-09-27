import { Types } from 'mongoose';
import mongoose, { Document } from 'mongoose';

interface User {
    username:string
    email:string
    _id: Types.ObjectId
    password: string
    isVerified : boolean
    image?: string; 
    friends: Types.ObjectId[];
    friendRequests: Types.ObjectId[];
}

interface Chat {
    messages : Message<Types.ObjectId,Date>[]
}

interface Message<T=string,D=string>{
    sender : T
    receiver?: string
    content : string
    timestamp: D
}

interface FriendRequest{
    id: string
    senderId: string
    receiverId : string
}

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    googleId?: string;
    isVerified: boolean;
    image: string;
    friends: mongoose.Types.ObjectId[]; // Array of ObjectId
    friendRequests: mongoose.Types.ObjectId[];
    chats: mongoose.Types.ObjectId[];
}

// Define the type for Friend Request Document
interface FriendRequestDocument {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    status: 'pending' | 'accepted' | 'declined'; // Adjust as necessary
}

export {User,Message,Chat,UserDocument,FriendRequestDocument}