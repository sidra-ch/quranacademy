import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        const bootstrapEmail = process.env.ADMIN_EMAIL;
        const bootstrapPassword = process.env.ADMIN_PASSWORD;

        if (
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        const existingAdmin = await prisma.adminUser.findUnique({
          where: { email }
        });

        if (existingAdmin) {
          const passwordMatches = await bcrypt.compare(password, existingAdmin.passwordHash);

          if (!passwordMatches) {
            return null;
          }

          await prisma.adminUser.update({
            where: { id: existingAdmin.id },
            data: { lastLoginAt: new Date() }
          });

          return {
            id: existingAdmin.id,
            name: existingAdmin.name ?? "Admin",
            email: existingAdmin.email
          };
        }

        if (email === bootstrapEmail && password === bootstrapPassword) {
          const passwordHash = await bcrypt.hash(password, 12);

          const createdAdmin = await prisma.adminUser.create({
            data: {
              email,
              name: "Admin",
              passwordHash,
              lastLoginAt: new Date()
            }
          });

          return {
            id: createdAdmin.id,
            name: createdAdmin.name ?? "Admin",
            email: createdAdmin.email
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8
  }
});
