'use client';

import { message } from "antd";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC } from "react";
import { IoExitOutline } from "react-icons/io5";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLDivElement> {
    sessionId?: string; // make this optional if it might not always be passed
}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
   
    return (
        <div {...props}>
            <button
                onClick={async () => {
                    try {
                        await signOut({ callbackUrl: '/signin' });
                    } catch (error) {
                        message.error("Something went wrong");
                    }
                }}
            >
                <IoExitOutline />
            </button>
        </div>
    );
}

export default SignOutButton;
