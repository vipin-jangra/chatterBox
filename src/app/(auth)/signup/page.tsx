'use client';

import {  FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { message } from 'antd';
import { useRouter } from "next/navigation";
import Loader from "@/lib/loader";
import { BsSend } from "react-icons/bs";

export default function Signup() {
    const router = useRouter();

    const [user,setUser] = useState({
        email : "",
        username: "",
        password : "",
    })


    const [loading,setLoading] = useState(false);

    const onsignup = async ()=>{
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup",user);
            if(response.data.success){
                message.success("Signup Successfully")
                router.push("/signin");
            }else{
                message.error(response.data.error);
            }

        } catch (error) {
            if (error instanceof Error) {
                message.error(error.message);
            } else {
                message.error("An unexpected error occurred.");
            }   
        } finally{
            setLoading(false);
        }  
    }

    return (
        
        <div className="flex flex-col items-center justify-center min-h-svh py-2 bg-slate-100">
            {loading && <Loader />}
            <div className="flex flex-col md:flex-row rounded-2xl h-full justify-center shadow-2xl w-full max-w-4xl text-center">
                
                <div className="w-full  p-5 bg-white rounded-br-2xl rounded-tl-none md:rounded-tl-none rounded-tr-2xl md:rounded-tr-none md:rounded-br-2xl">
                    <div className="flex mb-5">
                        <BsSend className="text-3xl text-zinc-500 mt-1 " />
                        <div className="text-left font-bold text-green-500 text-3xl ">
                            Chatter<span className="text-blue-300">Box</span>
                        </div>
                    </div>
                    <h2 className=" text-green-500 text-3xl font-bold mb-2">Create Account</h2>
                    <div className="border-2 w-10 border-green-500 mb-2 inline-block" />
                    
                    <div className="flex flex-col items-center">
                    <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
                            <FaRegEnvelope className="text-gray-400 m-2" />
                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                value = {user.username}
                                onChange = {(e) => setUser({...user,username:e.target.value}) }
                                className="bg-gray-100 border-none focus:ring-0 outline-none text-sm flex-1"
                            />
                        </div>
                        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
                            <FaRegEnvelope className="text-gray-400 m-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={user.email}
                                onChange = {(e) => setUser({...user,email:e.target.value})}
                                className="bg-gray-100 border-none focus:ring-0 outline-none text-sm flex-1"
                            />
                        </div>
                        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
                            <MdLockOutline className="text-gray-400 m-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value = {user.password}
                                onChange={(e) => setUser({...user, password:e.target.value})}
                                className="bg-gray-100 border-none focus:ring-0 outline-none text-sm flex-1"
                            />
                        </div>
                        
                        <div className="flex text-left w-full sm:w-64 mb-5">
                            
                            <Link href="/signin" className="text-xs">Already have and account? Login</Link>
                        </div>
                        <button onClick={onsignup} className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition duration-300">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
