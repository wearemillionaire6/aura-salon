"use client";

import React, { useState, useTransition, Suspense } from "react";
import { signInWithMagicLink } from "../actions";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowRight, Loader2, Sparkles } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("redirect", redirectUrl);

      const result = await signInWithMagicLink(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setSubmitted(true);
        toast.success("Magic link sent! Please check your email inbox.");
      }
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/10 via-transparent to-transparent pointer-events-none" />
      
      <Card className="w-full max-w-md border-stone-200/80 dark:border-stone-800/80 shadow-xl backdrop-blur-sm bg-white/70 dark:bg-stone-900/70 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200" />
        
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-100/50 dark:border-amber-900/30 mb-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-3xl font-light tracking-wide text-stone-900 dark:text-stone-100">
            Aura Salon
          </CardTitle>
          <CardDescription className="text-stone-500 dark:text-stone-400 font-light">
            Passwordless authentication. We will email you a secure magic link to sign in.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-stone-200 dark:border-stone-800 focus-visible:ring-amber-500 bg-white dark:bg-stone-950"
                    disabled={isPending}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-950 font-normal tracking-wide transition-all duration-300"
                disabled={isPending || !email}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Send Magic Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30">
                <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100">Check your email</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 font-light max-w-xs mx-auto">
                  We sent a temporary link to <span className="font-medium text-stone-800 dark:text-stone-200">{email}</span>. Click the link to securely sign in.
                </p>
              </div>
              <Button
                variant="link"
                className="text-stone-500 dark:text-stone-400 text-xs font-light"
                onClick={() => setSubmitted(false)}
              >
                Try a different email address
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="pb-8 justify-center border-t border-stone-100 dark:border-stone-800/50 pt-4">
          <p className="text-xs text-stone-400 dark:text-stone-500 font-light">
            By signing in, you agree to our Terms and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
