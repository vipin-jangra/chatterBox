import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { notFound } from "next/navigation";
import dbConnect from "../../../../lib/dbConfig"
import User from "../../../../models/userModel"


export async function POST(req:NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session) notFound()

        await dbConnect();

        const body = await req.json();

        const user = await User.find({_id:body.sessionId}).populate({
            path : "pendingFriendRequest",
            select: "name email image",
        });

        if(!user){
            return NextResponse.json({
                success: false,
                message: "No Pending requests"
            });
        }


        return NextResponse.json({
            success: true,
            data : user,
            message: "Pending requests"
        });


        
    } catch (error) {
        return NextResponse.json({error:"something went wrong"},
            {status:500})
    }
}