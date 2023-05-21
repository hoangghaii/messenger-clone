import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/libs/prismadb';

/* 
Here is the explanation for the code above:
1. We use the Prisma adapter to connect NextAuth.js to the database. The Prisma adapter is a community-maintained adapter that is not officially supported by NextAuth.js, but it works well and is easy to use.
2. We configure the providers that we want to use. In this case, we use the following providers:
    GitHubProvider: This provider allows users to sign in with their GitHub account.
    FacebookProvider: This provider allows users to sign in with their Facebook account.
    GoogleProvider: This provider allows users to sign in with their Google account.
    CredentialsProvider: This provider allows users to sign in with an email and a password.
3. We set the debug property to true to enable debug mode. In debug mode, you can see the session data and the database queries in the console.
4. We configure the session property. The strategy property represents the type of session that we want to use. In this case, we use JSON Web Token (JWT) sessions. The JWT session is the most secure session type, so it is recommended for production.
5. We set the secret property to a secret string. This secret string is used to sign and verify the JWT tokens. It should be a random string that is long and complex. 
*/

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
