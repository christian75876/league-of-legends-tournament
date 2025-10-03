import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: { id: string; role: "ADMIN" } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT { sub?: string; role?: "ADMIN"; }
}
