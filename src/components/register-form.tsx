"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { register } from "@/app/(authenticated)/auth/actions/auth-actions";
import { FormEventHandler } from "react";
import { toast } from "sonner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await register(formData)
      .then(() => toast.success("User created successfully!"))
      .catch(() => toast.error("Error creating user"));
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Floow Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">
              Faça seu cadastro ao Floow Inc.
            </h1>
            <div className="text-center text-sm">
              Já possui uma conta?{" "}
              <Link
                href="/auth/login"
                className="underline underline-offset-4"
              >
                Entrar
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome de usuário</Label>
              <Input
                id="name"
                type="name"
                name="name"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Digite sua senha"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              Acessar
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
