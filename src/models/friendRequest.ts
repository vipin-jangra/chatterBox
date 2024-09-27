import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    }
}, { timestamps: true });

const FriendRequest = mongoose.models.friendrequests || mongoose.model('friendrequests', friendRequestSchema);

export default FriendRequest;
