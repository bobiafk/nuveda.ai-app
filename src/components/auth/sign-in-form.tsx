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

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const remember = watch("remember");

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await signIn(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch {
      toast.error("Could not sign in. Please try again.");
    }
  });

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google");
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <header className="space-y-2">
        <h2 className="text-3xl font-display font-semibold tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to continue creating with NuvedaAI.
        </p>
      </header>

      <GoogleButton onClick={onGoogle} loading={googleLoading} disabled={isSubmitting} />

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          or with email
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className="h-11 rounded-xl"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 select-none cursor-pointer">
          <Checkbox
            checked={!!remember}
            onCheckedChange={(c) => setValue("remember", c === true)}
          />
          <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
        </label>

        <button type="submit" disabled={isSubmitting} className="btn-generate">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
