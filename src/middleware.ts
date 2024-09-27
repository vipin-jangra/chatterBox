import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware'

export default withAuth(async function middleware(request: NextRequest){
    const path = request.nextUrl.pathname;

    const token = await getToken({
        req: request,
        secret : process.env.NEXTAUTH_SECRET
    })
    
    const isPublicPath = path === "/signin" || path === "/signup"
    
    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    if(path ==='/' || !isPublicPath && !token){
        return NextResponse.redirect(new URL('/signin', request.nextUrl));
    }

},{
    callbacks:{
        async authorized(){
            return true
        },
    },
}
)

export const config = {
    matcher : [
        '/',
        '/signin',
        '/signup',
        '/dashboard'
    ]
}