"use client";

import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pillStyles } from "@/lib/ui-styles";

interface BasicsProps {
  form: UseFormReturn<FormData>;
}

export function Basics({ form }: BasicsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const openToCoaching = watch("openToCoaching");

  function toggleCoaching(val: boolean) {
    setValue("openToCoaching", openToCoaching === val ? undefined : val, {
      shouldDirty: true,
    });
  }

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

        {/* Sleep motivation */}
        <div>
          <Label htmlFor="sleepMotivation" className="text-sm font-medium">
            Why do you want better sleep?
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Focus on what you value that better sleep would specifically enable — not surface-level goals. For example: <span className="italic">&ldquo;improving sleep will allow me to have longer writing sessions with sustained focus.&rdquo;</span>
          </p>
          <Textarea
            id="sleepMotivation"
            placeholder="What in your life would better sleep unlock or improve?"
            className="mt-1.5"
            {...register("sleepMotivation")}
          />
        </div>

        {/* Open to coaching */}
        <div>
          <Label className="text-sm font-medium">
            Are you open to being coached to improve your sleep?
          </Label>
          <div className="mt-3 flex gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => toggleCoaching(val)}
                className={`flex-1 rounded-full border-2 py-3 text-sm font-medium transition-colors ${
                  openToCoaching === val ? pillStyles.selected : pillStyles.unselected
                }`}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
