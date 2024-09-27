import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import User from "../../../../models/userModel";
import dbConnect from "../../../../lib/dbConfig";
import Chats from "../../../../models/chat";



export async function POST(req:NextRequest){
    try {
        await dbConnect();
        const {text,chatId} = await req.json();
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({
                message:'Unauthorized',
                success:false
            },{status:401})
        }

        const [userId1, userId2] = chatId.split('--');
        
        if(session.user?.id !== userId1 && session.user.id !== userId2){
            return NextResponse.json({
                message:'Unauthorized',
                success:false
            },{status:401})
            
        }

        const friendId = session.user?.id === userId1 ? userId2 : userId1

        const friendList = await User.findOne({_id:session.user?.id}).select('friends')
        const isFriend = friendList.friends.includes(friendId)
        if(!isFriend){
            return NextResponse.json({
                message:'Unauthorized',
                status:401,
                sucess:false
            })
        }

       
        let chat = await Chats.findOne({chatId:chatId})
        if(!chat){
            chat = new Chats({
                chatId : chatId,
                participants : [userId1,userId2],
                messages: [],
            });

            await chat.save();
    
           
            await User.updateMany(
                { _id: { $in: [userId1, userId2] } }, 
                { $addToSet: { chats: chat._id } }   
            );
        }

        

        
        chat.messages.push({
            sender: session.user?.id,
            content: text,
            timestamp : new Date(),
        });

        await chat.save();

        return NextResponse.json({
            message:'Message sent',
            success:true,
            status:200,
            data:{
                sender: session.user?.id,
                receiver : friendId,
                content: text,
                timestamp : new Date(),
            }
        });

    } catch (error) {
        return NextResponse.json({
            message:'Internal server error',
            status:500,
            success:false
        })
    }
}