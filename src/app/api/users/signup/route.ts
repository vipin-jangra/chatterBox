import dbConnect from '@/lib/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

dbConnect();

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json();
        const {username, email, password} = reqBody;

        if(username === '' || email === "" || password === ""){
            return NextResponse.json({
                error: "Please enter required fields",
                success: false
            })
        }
        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({
                error:'User already exist',
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password:hashedPassword,
        })

        const savedUser = await newUser.save();


        // await sendEmail({email,emailType:"VERIFY",userId:savedUser._id});

        return NextResponse.json({
            message : "User created successfully",
            success : true,
            savedUser
        })

    } catch (error) {
        return NextResponse.json({error:"Something went wrong"},
        {status:500})
    }
}