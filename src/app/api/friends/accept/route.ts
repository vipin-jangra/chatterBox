// pages/api/friendRequests.ts

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/options";
import User, { UserDocument } from "@/models/userModel"; // Import UserDocument type
import FriendRequest from "@/models/friendRequest";
import mongoose from "mongoose";

// Function to check if a friend request exists
async function checkFriendRequest(currentUser: UserDocument, userToAdd: UserDocument): Promise<boolean> {
    try {
        const hasFrndRqst = await FriendRequest.findOne({
            sender: userToAdd._id,
            receiver: currentUser._id,
        });

       // Ensure both IDs are treated as ObjectId
       const userToAddId = userToAdd._id as mongoose.Types.ObjectId;
       return (
           currentUser?.friendRequests.includes(userToAddId) && !!hasFrndRqst
       );
    } catch (error) {
        return false;
    }
}

// Function to accept a friend request
async function AcceptRequest(currentUser: UserDocument, userToAdd: UserDocument): Promise<void> {
    try {
        // Ensure user IDs are of type ObjectId
        const currentUserId = currentUser._id as mongoose.Types.ObjectId;
        const userToAddId = userToAdd._id as mongoose.Types.ObjectId;

        // Add both users to each other's friends array
        currentUser.friends.push(userToAddId);
        userToAdd.friends.push(currentUserId);

        // Update friend request status to accepted
        await FriendRequest.updateOne(
            {
                sender: userToAdd._id,
                receiver: currentUser._id,
            },
            {
                $set: { status: 'accepted' }
            }
        );

        // Remove from current user's friend request array
        currentUser.friendRequests = currentUser.friendRequests.filter(
            (requestId) => requestId.toString() !== userToAddId.toString()
        );

        // Save both users' updated data
        await currentUser.save();
        await userToAdd.save();
    } catch (error) {
        throw new Error("Failed to accept friend request");
    }
}

// POST API to accept friend requests
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id: isToAdd } = z.object({ id: z.string() }).parse(body);

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                success: false,
                msg: 'Unauthorized',
                status: 401,
            });
        }

        const currentUser = (await User.findById(session.user?.id).lean()) as UserDocument; // Cast to UserDocument
        const userToAdd = (await User.findById(isToAdd).lean()) as UserDocument; // Cast to UserDocument

        // Verify both users are not already friends
        if (currentUser?.friends.includes(userToAdd?._id as mongoose.Types.ObjectId) || userToAdd?.friends.includes(currentUser?._id as mongoose.Types.ObjectId)) {
            return NextResponse.json({
                msg: "Already friends",
                success: false,
                status: 400,
            });
        }

        // Check if request is sent or not
        const hasFriendRequest = await checkFriendRequest(currentUser, userToAdd);
        if (!hasFriendRequest) {
            return NextResponse.json({
                msg: "No friend request",
                status: 500,
                success: false,
            });
        }

        // Accept the friend request
        await AcceptRequest(currentUser, userToAdd);

        return NextResponse.json({
            msg: "Friend request accepted",
            status: 200,
            success: true,
        });

    } catch (error) {
        return NextResponse.json({
            msg: "Something went wrong",
            success: false,
            status: 400,
        });
    }
}
