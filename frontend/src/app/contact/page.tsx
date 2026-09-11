"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitContactMessage } from "@/lib/api";
import { contactFormSchema, type ContactFormValues } from "@/lib/contact-schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,var(--accent-glow),transparent_45%)]"
      />
      <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-accent uppercase">
          Contact
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Discutons
        </h1>
        <p className="text-muted">Une question, une opportunité ? Écrivez-moi.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} {...register("message")} />
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

          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </Button>
        </form>
      </div>
    </section>
  );
}
