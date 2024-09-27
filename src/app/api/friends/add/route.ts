import dbConnect from "@/lib/dbConfig"
import { addFriendValidator } from "@/lib/validations/add-friend"
import User from "@/models/userModel"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/options"
import FriendRequest from "@/models/friendRequest"


export async function POST(req: NextRequest){
    try {

        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({
                status:401,
                success: false,
                msg: "Unauthorized"
            })
        }

        const body = await req.json()
        const {email: emailToAdd} = addFriendValidator.parse(body)

        await dbConnect()

        const userToAdd = await User.findOne({email:emailToAdd})
        
        if(!userToAdd){
            return NextResponse.json({
                status:400,
                success:false,
                msg:"User does not exist",
            })
        }

        const currentUser = await User.findOne({ email: session.user!.email });

        if (!currentUser) {
            return NextResponse.json({
                status: 500,
                success: false,
                msg: "Current user not found",
            });
        }

        // Convert IDs to strings for comparison
        const isToAdd = userToAdd._id.toString();
        const currentUserId = currentUser._id.toString();

        if(isToAdd === currentUserId){
            return NextResponse.json({
                status:400,
                success:false,
                msg:"You cannot add yourself as a friend",
            })
        }

        if(currentUser.friends.includes(isToAdd)){
            return NextResponse.json({
                status: 400,
                success: false,
                msg : "User is already your friend"
            })
        }

        if(userToAdd.friendRequests.includes(isToAdd)){
            return NextResponse.json({
                status: 400,
                success: false,
                msg: "Friend request already sent"
            })
        }  

        const friendRequest = new FriendRequest({
            sender : currentUser._id,
            receiver : userToAdd._id,
        })
        await friendRequest.save();

        userToAdd.friendRequests.push(currentUser._id)
        await userToAdd.save();


        const responseData = {
            sender : currentUser._id,
            receiver : userToAdd._id,
            email: currentUser.email,
            username: currentUser.username,
            image: currentUser.image,
        }

        return NextResponse.json({
            success: true,
            data : responseData,
            msg: "Friend added successfully"
        })
        
    } catch (error) {
        return NextResponse.json({error:"something went wrong"},
            {status:500})
    }
}