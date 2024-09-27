import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for UserDocument
export interface UserDocument extends Document {
    username: string;
    email: string;
    password?: string; // Optional because it's not selected by default
    googleId?: string;
    isVerified: boolean;
    image?: string; // Optional to allow undefined
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
    chats: mongoose.Types.ObjectId[];
}

// Define the User schema
const userSchema = new Schema<UserDocument>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        googleId: { type: String },
        isVerified: { type: Boolean, default: false },
        image: { type: String, default: '/images/user.png' },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
        chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chat' }]
    },
    { timestamps: true }
);

// Create the User model
const User = mongoose.models.users || mongoose.model<UserDocument>('users', userSchema);

export default User;
