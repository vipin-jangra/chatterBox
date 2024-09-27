
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
    content : {type: String, required: true},
    timestamp : {type: Date, default: Date.now}
},{_id:false})

const ChatSchema = new mongoose.Schema({
    chatId : {type: String, required: true},
    participants : [{type: mongoose.Schema.Types.ObjectId, ref:'users', required:true}],
    messages : [messageSchema],
},{timestamps: true})

const Chats = mongoose.models?.chat || mongoose.model('chat', ChatSchema)
export default Chats