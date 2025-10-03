"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
    return (
        <form onSubmit={async (e) => { e.preventDefault(); await signIn("credentials", { email, password, callbackUrl: "/admin" }); }} className="max-w-sm mx-auto p-6 space-y-3">
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="bg-black text-white px-4 py-2">Entrar</button>
        </form>
    );
}
