"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { SubmitButton } from "@/components/admin/ui";

export default function LoginPage() {
  const [state, action] = useActionState(loginAction, null);
  return (
    <main className="tiles relative grid min-h-screen place-items-center overflow-hidden p-5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(242,140,0,.6)_100%)]" />
      <motion.div
        initial={{ y: 40, opacity: 0, rotate: -2 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="relative w-full max-w-sm rounded-[2rem] border-4 border-cocoa-700 bg-cream p-8 shadow-[10px_10px_0_var(--color-cocoa-700)]"
      >
        <div className="text-center">
          <motion.span className="inline-block text-6xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            👩‍🍳
          </motion.span>
          <h1 className="mt-2 font-display text-4xl text-cocoa-700">Gerenciador</h1>
          <p className="text-sm text-cocoa-500">Acesso restrito à cozinha 😉</p>
        </div>
        <form action={action} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-cocoa-700">
              <Lock size={14} /> Senha
            </span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full rounded-xl border-2 border-cocoa-700 bg-white px-3 py-3 outline-none focus:ring-4 focus:ring-mustard-300"
            />
          </label>
          {state && !state.ok && (
            <motion.p key={state.at} initial={{ x: -10 }} animate={{ x: [10, -8, 6, 0] }} className="text-sm font-bold text-red-700">
              {state.message}
            </motion.p>
          )}
          <SubmitButton className="w-full py-3 text-lg">Entrar</SubmitButton>
        </form>
        <Link href="/" className="mt-5 block text-center text-sm font-bold text-cocoa-500 hover:underline">
          ← voltar ao site
        </Link>
      </motion.div>
    </main>
  );
}
