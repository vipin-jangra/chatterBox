import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/userModel";
import bcrypt from 'bcryptjs';
import dbConnect from "../../../../lib/dbConfig";
import { User as NextAuthUser, Account, Profile } from 'next-auth';

// Define the argument types for the signIn function
interface SignInProps {
  user: NextAuthUser;
  account: Account | null;
  profile?: Profile;
}

function getGoogleCredentials(){
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || clientID.length === 0) {
    throw new Error("Missing google client id");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing google client secret");
  }

  return { clientID, clientSecret };
}

async function findUserInDatabase(email: string) {
  try {
    await dbConnect();
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {

        await dbConnect();

        const user = await User.findOne({ email: credentials!.email }).select('_id username password email');
        
        if (!user) {
          throw new Error('No user found with the email');
        }
        
        const validPassword = await bcrypt.compare(credentials!.password, user.password);
        if (!validPassword) {
          throw new Error('Invalid password');
        }
        return user;
      }
    }),
    GoogleProvider({
      clientId: getGoogleCredentials().clientID,
      clientSecret: getGoogleCredentials().clientSecret,
      authorization: {
        params: {
          prompt: 'select_account',
          redirect_uri: process.env.GOOGLE_REDIRECT_URI
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbuser = await findUserInDatabase(user.email!)
  
        if (!dbuser) {
          // When user is not found in the DB, create a token using user info
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;
        } else {
          // If the user is in the DB, use DB fields for the token
          token.id = dbuser._id;
          token.email = dbuser.email;
          token.name = dbuser.username;
          token.image = dbuser.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        name: token.name,
        image: typeof token.image === 'string' ? token.image : null,
      };
      return session;
    },
    async signIn({ user, account, profile }: SignInProps) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          const { email } = user;
    
          // Cast profile to the structure expected from Google's response
          const googleProfile = profile as Profile & { picture?: string, sub?: string };
    
          const userExist = await User.findOne({ email });
          if (!userExist) {
            await User.create({
              email: googleProfile?.email,
              username: googleProfile?.name,
              googleId: googleProfile?.sub,
              image: googleProfile?.picture, // Now TypeScript knows `picture` exists
            });
          }
    
          return true; // Proceed to sign in
        } catch (error) {
          return false;
        }
      }
    
      return true; // For credential sign-ins, proceed by default
    }
   
  },
  secret : process.env.NEXTAUTH_SECRET!
}
