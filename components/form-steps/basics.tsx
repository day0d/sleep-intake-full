"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

      {/* Intake intro */}
      <div className="mt-6 w-full max-w-sm rounded-2xl border border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground space-y-1.5">
        <p>⏱ This intake takes about <span className="font-medium text-foreground">15 minutes</span>. Fill it out to the best of your knowledge — skip anything you&apos;re unsure of.</p>
        <p>🎯 The purpose is to inform your <span className="font-medium text-foreground">Sleep Strategy Session</span>, which you&apos;ll book at the end. In that session, we&apos;ll build a personalized plan covering supplements, behavioral protocols, and sleep environment redesign.</p>
      </div>

      <div className="mt-8 w-full max-w-sm space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Your name
          </Label>
          <Input
            id="name"
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

        {/* Sleep motivation */}
        <div>
          <Label htmlFor="sleepMotivation" className="text-sm font-medium">
            What are you most hoping that better sleep will unlock in your life?
          </Label>
          <Textarea
            id="sleepMotivation"
            className="mt-1.5"
            {...register("sleepMotivation")}
          />
        </div>
      </div>
    </div>
  );
}
