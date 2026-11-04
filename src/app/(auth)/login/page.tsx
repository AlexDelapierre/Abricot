"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: "",
  });

  return (
    <div className="flex min-h-screen">
      <div className="bg-grey-50 flex w-full flex-col items-center justify-between px-4 py-14 md:w-[39%] md:px-[140px]">
        <Image src="/logo.svg" alt="Abricot" width={253} height={32} priority />

        <form
          action={formAction}
          className="flex w-full max-w-[282px] flex-col gap-[29px] py-10"
        >
          <h1 className="text-brand-dark text-center text-[40px] leading-[55px] font-bold">
            Connexion
          </h1>

          <label className="flex flex-col gap-[7px] text-sm">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
            />
          </label>

          <label className="flex flex-col gap-[7px] text-sm">
            Mot de passe
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
            />
          </label>

          {state.error && (
            <p role="alert" className="text-error text-sm">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-card bg-grey-800 disabled:bg-grey-400 h-[50px] self-center px-[74px] text-white"
          >
            {isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="w-full max-w-[282px] text-sm">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-brand-dark underline">
            Créer un compte
          </Link>
        </p>
      </div>

      <div className="relative hidden flex-1 md:block">
        <Image
          src="/login-background.jpg"
          alt=""
          fill
          sizes="61vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
