"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await signUp(values.name, values.email, values.password);
      toast.success(`Account created — welcome, ${user.name.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch {
      toast.error("Could not create account. Please try again.");
    }
  });

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed up with Google");
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-up failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-7 animate-slide-up">
      <header className="space-y-2">
        <h2 className="text-3xl font-display font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-muted-foreground">
          Start generating with NuvedaAI — no card required.
        </p>
      </header>

      <GoogleButton
        onClick={onGoogle}
        loading={googleLoading}
        disabled={isSubmitting}
        label="Sign up with Google"
      />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          or with email
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={!!errors.name}
            className="h-11 rounded-xl"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="8+ characters"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter password"
              aria-invalid={!!errors.confirmPassword}
              className="h-11 rounded-xl"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-start gap-2.5 select-none cursor-pointer pt-1">
          <Checkbox
            checked={!!acceptTerms}
            onCheckedChange={(c) =>
              setValue("acceptTerms", c === true, { shouldValidate: true })
            }
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground leading-snug">
            I agree to the{" "}
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-generate">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
