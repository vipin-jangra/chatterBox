// next-auth.d.ts

import { DefaultSession } from 'next-auth';

// Extend the JWT interface
declare module 'next-auth/jwt' {
    interface JWT {
        id: string; // Ensure this matches the type you're using in your auth options
    }
}

// Extend the Session interface
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string; // Adding the id property here
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}
