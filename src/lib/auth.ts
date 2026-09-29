import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        console.log("Login attempt received", {
          email,
          hasPassword: Boolean(password),
          hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
          hasNextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
          nodeEnvironment: process.env.NODE_ENV,
        });

        if (!email || !password) {
          console.log("Login rejected: missing email or password.");

          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            console.log("Login rejected: user was not found.", {
              email,
            });

            return null;
          }

          console.log("User found during login attempt", {
            id: user.id,
            email: user.email,
            role: user.role,
            hasPasswordHash: Boolean(user.passwordHash),
          });

          const validPassword = await bcrypt.compare(
            password,
            user.passwordHash,
          );

          if (!validPassword) {
            console.log("Login rejected: password comparison failed.", {
              email,
            });

            return null;
          }

          console.log("Login accepted.", {
            id: user.id,
            email: user.email,
            role: user.role,
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Unexpected error during credentials login:", error);

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};