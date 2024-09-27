import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { z } from "zod";
import User from "@/models/userModel";
import FriendRequest from "@/models/friendRequest";


export async function POST(req:NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({
                msg:'Unauthorized',
                status:401,
                success:false

            })
        }

        const body = await req.json()

        const {id:isToReject} = z.object({id: z.string()}).parse(body)
        const currentUser = await User.findById(session.user?.id)

        currentUser.friendRequests = currentUser.friendRequests.filter(
            (requestId: number ) => requestId.toString() !== isToReject.toString()
        )

        await FriendRequest.updateOne(
            {
                sender:isToReject,
                receiver:currentUser._id
            },
            {
                $set :{status: 'declined'}
            }
        )

        await currentUser.save();

        return NextResponse.json({
            msg:'Friend request declined',
            status:200,
            success:true
        })

    } catch (error:unknown) {
        let errorMessage = "An unknown error occurred";

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({
        
            msg:errorMessage,
            status:500,
            success:false
        })
    }
}