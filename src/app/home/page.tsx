'use client'
import { signOut } from "next-auth/react"


const page = ()=>{
    
    return (
        <div>
            <button onClick={()=> signOut({redirect:true})} >Signout</button>
        </div>
    )
}

export default page;