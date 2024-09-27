import AddFriendButton from "../../../../components/AddFriendButton";
import { FC } from "react";

const page: FC = () => {
    return (
        <div className="relative flex flex-col h-full w-full bg-slate-100 ">
            {/* Background Image */}
            <div
                style={{
                    backgroundImage: 'url("/images/wallapaper.jpeg")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 before:absolute before:inset-0 before:bg-slate-100 before:opacity-80"
            />

            <div className="relative z-10 w-full flex p-3">
                <AddFriendButton />
                
            </div>
        </div>
    );
};

export default page;
