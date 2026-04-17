"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicsProps {
  form: UseFormReturn<FormData>;
}

export function Basics({ form }: BasicsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col items-center px-6 py-8">
      <h1 className="text-center text-2xl font-bold text-foreground">
        Let&apos;s start with the basics
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        So I know who I&apos;m talking to.
      </p>

      <div className="mt-10 w-full max-w-sm space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Your name
          </Label>
          <Input
            id="name"
            placeholder="First name is fine"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Your email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1.5 h-12 rounded-xl text-base"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
