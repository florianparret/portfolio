"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitContactMessage } from "@/lib/api";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";

const inputClassName =
  "rounded-md border border-black/[.08] px-3 py-2 dark:border-white/[.145] dark:bg-transparent";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    setStatus("idle");
    const success = await submitContactMessage(data);

    if (success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(79,70,229,0.10),transparent_45%)] dark:bg-[radial-gradient(circle_at_85%_15%,rgba(129,140,248,0.14),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Une question, une opportunité ? Écrivez-moi.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Nom
            </label>
            <input id="name" {...register("name")} className={inputClassName} />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input id="email" type="email" {...register("email")} className={inputClassName} />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register("message")}
              className={inputClassName}
            />
            {errors.message && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
            )}
          </div>

          {status === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Message envoyé, merci !
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Impossible d&apos;envoyer le message pour le moment. Réessaie plus tard.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </div>
    </section>
  );
}
