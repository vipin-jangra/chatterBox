'use client'

import { SessionProvider } from "next-auth/react"
import { Provider as ReduxProvider} from 'react-redux';
import store from "@/redux/store";
import Notification from "./Notification";

const Provider = ({children}: { children: React.ReactNode})=>{

    return (
        <SessionProvider >
            <ReduxProvider store={store}>
                <Notification />
                {children}
            </ReduxProvider>
        </SessionProvider>
    )
}

export default Provider;