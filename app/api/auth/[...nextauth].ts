import NextAuth from "next-auth"
import { CredentialsProvider } from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Prisma } from "@prisma/client"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email'},
                password: { label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                const user = await Prisma.user.findUnique({
                    where: { email: credentials?.email},
                })

                if (user && user.password === credentials?.password) {
                    return user
                }
                return null
            }
        })
    ],

    session: {
        strategy: 'jwt', // Use JWT for session management
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin', //Redirect here for sign in
    }
}

export default NextAuth(authOptions)