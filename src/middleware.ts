import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/signin' || path === '/signup';

    // Redirect authenticated users away from signin/signup pages
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    // If user is not authenticated and trying to access protected routes, redirect to signin
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/signin', request.nextUrl));
    }

    // Allow access to the requested page
    return NextResponse.next();
}, {
    callbacks: {
        authorized: () => true,
    },
});

export const config = {
    matcher: ['/', '/signin', '/signup', '/dashboard'],
};
