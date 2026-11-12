"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions";
import type { User } from "@/types";

export default function ProfileForm({ user }: { user: User }) {
  const [firstName, ...lastName] = (user.name ?? "").split(" ");
  const [state, formAction, isPending] = useActionState(updateProfileAction, {
    error: "",
    success: "",
    lastName: lastName.join(" "),
    firstName,
    email: user.email,
  });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-[7px] text-sm">
        Nom
        <input
          name="lastName"
          defaultValue={state.lastName}
          autoComplete="family-name"
          className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
        />
      </label>

      <label className="flex flex-col gap-[7px] text-sm">
        Prénom
        <input
          name="firstName"
          defaultValue={state.firstName}
          autoComplete="given-name"
          className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
        />
      </label>

      <label className="flex flex-col gap-[7px] text-sm">
        Email
        <input
          name="email"
          type="email"
          defaultValue={state.email}
          autoComplete="email"
          required
          className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
        />
      </label>

      <label className="flex flex-col gap-[7px] text-sm">
        Mot de passe actuel
        <input
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
        />
      </label>

      <label className="flex flex-col gap-[7px] text-sm">
        Nouveau mot de passe
        <input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          aria-describedby="password-rule"
          className="border-grey-200 rounded-sm border bg-white px-[17px] py-[19px] text-base"
        />
        <span id="password-rule" className="text-grey-600 text-xs">
          Laissez vide pour garder votre mot de passe. Sinon : 8 caractères
          minimum, avec une majuscule, une minuscule, un chiffre et un caractère
          spécial parmi @$!%*?&amp;
        </span>
      </label>

      {state.error && (
        <p role="alert" className="text-error text-sm">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="text-success text-sm">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-card bg-grey-800 hover:bg-grey-950 disabled:bg-grey-200 disabled:text-grey-400 h-[50px] self-start px-7 text-white"
      >
        {isPending ? "Modification..." : "Modifier les informations"}
      </button>
    </form>
  );
}
