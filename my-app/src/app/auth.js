import CredentialsProvider from "next-auth/providers/credentials"
import User from "./utils/models/User";
import bcrypt from "bcryptjs";
import DBConnection from "./utils/config/db";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",

            async authorize(credentials) {
                await DBConnection();
                const user = await User.findOne({ email: credentials.email });
                console.log(user);
                if (user) {
                    const isPasswordMatched = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordMatched) {
                        return user;
                    }
                }
                return null;
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user._id?.toString() || user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role || "user";
                token.image = user.image || "";
            }
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.email) token.email = session.email;
                if (session.image !== undefined) token.image = session.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.image = token.image || "";
            }
            return session;
        }
    },
};