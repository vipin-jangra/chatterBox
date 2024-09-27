import User from '../../../../models/userModel';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '../../../../lib/dbConfig';

// API route for searching friends by username or email
export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                status: 401,
                success: false,
                msg: "Unauthorized"
            });
        }

        const { query } = await req.json(); // Get search query from request

        // Check if query is provided
        if (!query) {
            return NextResponse.json({ success: false, msg: "Search query is required" }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user!.email });

        if (!currentUser) {
            return NextResponse.json({
                status: 500,
                success: false,
                msg: "Current user not found",
            });
        }

        // Search users by email or username, excluding the current user
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser._id } }, // Exclude current user
                {
                    $or: [
                        { email: { $regex: query, $options: 'i' } }, // Case-insensitive search by email
                        { username: { $regex: query, $options: 'i' } } // Case-insensitive search by username
                    ]
                }
            ]
        }).select('email username image friends friendRequests'); // Include friends and friendRequests


        // If no users are found
        if (users.length === 0) {
            return NextResponse.json({ success: false, msg: "No users found" }, { status: 404 });
        }

        // Map through users to add the status based on friend requests and friends
        const usersWithStatus = users.map(user => {
            const isFriend = user.friends.includes(currentUser._id); // Check if user is a friend
            const hasRequested = user.friendRequests.includes(currentUser._id); // Check if a friend request has been sent

            return {
                ...user.toObject(), // Convert user to plain object
                requestSent: isFriend ? 'accepted' : hasRequested ? 'requested' : 'none' // Set status
            };
        });

        // Return the found users
        return NextResponse.json({ success: true, data: usersWithStatus }, { status: 200 });

    } catch (error) {
        
        return NextResponse.json({ success: false, msg: "Internal server error" }, { status: 500 });
    }
}
