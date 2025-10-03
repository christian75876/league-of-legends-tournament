import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Admin",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      authorize: async (creds) => {
        const email = creds?.email?.toString().trim();
        const password = creds?.password?.toString() ?? "";
        if (!email || !password) return null;
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin?.hashedPassword) return null;
        const ok = await bcrypt.compare(password, admin.hashedPassword);
        if (!ok) return null;
        return { id: admin.id, email: admin.email, name: admin.name ?? "Admin" };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) { if (user?.id) { token.sub = user.id; token.role = "ADMIN"; } return token; },
    async session({ session, token }) { session.user = { id: token.sub ?? "", role: "ADMIN", name: session.user?.name ?? "Admin", email: session.user?.email ?? null }; return session; }
  },
  secret: process.env.AUTH_SECRET
};
const handler = NextAuth(authOptions);
export { handler };
