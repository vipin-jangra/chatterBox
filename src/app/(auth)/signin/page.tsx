'use client';

import Loader from "@/lib/loader";
import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { BsSend } from "react-icons/bs";

export default function Signin() {
    const router = useRouter()
    const [user,setUser] = useState({
        email:"",
        password:""
    });

    const [loading,setLoading] = useState<boolean>(false);

    const handleGoogleLogin = async () => {
        setLoading(true)
        try {
            
            await signIn("google");
        } catch (error) {
            message.error("Something went wrong with your login.")
        } finally{
            setLoading(false)
        }
      };

    const onSignIn = async ()=>{
        try {
            setLoading(true)
            const response = await signIn("credentials",{
                redirect: false,
                email: user.email,
                password: user.password
            })

            if(response?.error){
                message.error(response.error)
            } else if(response?.ok){
                message.success("SignIn successfully")
                router.push("/dashboard")
            } else {
                message.error("Unexpected Error Occurred")
            }

        } catch (error:unknown) {
            message.error((error as Error).message);
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
            {loading && <Loader />}
            <div className="flex flex-col md:flex-row rounded-2xl shadow-2xl w-full md:max-w-4xl text-center">
                {/* Left Side - Sign Up Section */}
                <div className="w-full md:w-2/5 text-white bg-green-500 rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none sm:rounded-bl-2xl pt-10 pb-10 md:pb-36 px-12">
                    <div className="flex ">
                    <BsSend className="text-3xl text-white mt-1 " />
                    <div className="text-left font-bold text-white text-4xl ">
                    Chatter<span className="text-blue-300">Box</span>
                    </div>
                </div>
                    <div className="my-5 border-2 w-10 border-white"></div>
                    
                    <h2 className="text-3xl font-bold mb-2">Hello Friend!</h2>
                    <p className="mb-2">Fill up personal information and start your journey with us.</p>
                    <Link href="/signup" className="border-2 border-white text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500 transition duration-300">
                        Sign Up
                    </Link>
                </div>

                {/* Right Side - Sign In Section */}
                <div className="w-full md:w-3/5 p-5 bg-white rounded-bl-none rounded-br-2xl rounded-tl-none md:rounded-tl-none rounded-tr-2xl md:rounded-tr-none md:rounded-br-2xl">
                    <h2 className=" text-green-500 text-3xl font-bold mb-2">Sign in to Account</h2>
                    <div className="border-2 w-10 border-green-500 mb-2 inline-block" />
                    <div className="flex justify-center my-2">
                        <button onClick={handleGoogleLogin} className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                <Image className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" width={24} height={24}  />
                                <span>Login with Google</span>
                        </button>
                    
                    </div>
                    <p className="text-gray-400 my-3">or use your email account</p>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
                            <FaRegEnvelope className="text-gray-400 m-2" />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({...user,email:e.target.value})}
                                className="bg-gray-100 border-none focus:ring-0 outline-none text-sm flex-1"
                            />
                        </div>
                        <div className="bg-gray-100 w-full sm:w-64 p-2 flex items-center mb-3">
                            <MdLockOutline className="text-gray-400 m-2" />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={user.password}
                                onChange={(e) => setUser({...user,password:e.target.value})}
                                className="bg-gray-100 border-none focus:ring-0 outline-none text-sm flex-1"
                            />
                        </div>
                        <div className="flex justify-between w-full sm:w-64 mb-5">
                            <label className="flex items-center text-xs">
                                <input type="checkbox" name="remember" className="mr-1" />
                                Remember me
                            </label>
                            <a href="#" className="text-xs">Forget password?</a>
                        </div>
                        <button onClick={onSignIn} className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition duration-300">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
