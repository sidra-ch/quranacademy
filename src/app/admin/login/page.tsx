"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MoonStar } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div>
        <label className="mb-1.5 block text-xs text-white/70">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@hafizkamranacademy.com"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37]/60"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs text-white/70">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37]/60"
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-xs text-rose-300">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[linear-gradient(135deg,#D4AF37,#b8940e)] py-2.5 text-sm font-semibold text-[#111827] transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#0a2f2a_0%,#051a17_48%,#020b0a_100%)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37]/40 bg-[linear-gradient(135deg,#0F766E,#064E3B)] shadow-[0_0_40px_rgba(212,175,55,0.2)]">
            <MoonStar className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-white/60">Hafiz Kamran Quran Academy</p>
        </div>

        <Suspense fallback={<div className="h-48 rounded-2xl border border-white/15 bg-white/5" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
