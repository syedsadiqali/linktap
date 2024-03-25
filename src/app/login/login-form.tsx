"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import Messages from "./messages";
import Link from "next/link";
import GoogleLogo from "@/components/GoogleLogo";
import { createClient } from "@/lib/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { useState } from "react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const handleSignup = async (
    e: any,
    options: {
      type: string;
      provider: Provider;
    }
  ) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = window.location.origin + "/api/auth/callback";

      if (type === "oauth") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-[50%] h-[100%] flex-1 flex mx-auto justify-center gap-2 max-w-lg items-center "
      action="/auth/sign-in"
      method="post"
    >
      <Card>
        <CardHeader className="px-0">
          <CardTitle>Log In / Sign Up</CardTitle>
          <CardDescription>
            Log into your account or sign up for a new one to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Label className="text-md" htmlFor="email">
            Email
          </Label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border"
            name="email"
            placeholder="you@example.com"
            required
          />
          <Button size={"lg"} className="mb-2">Continue</Button>

          {/* <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div> */}

          {/* <Button
            type="button"
            size={"lg"}
            className="flex items-center bg-gray-900 hover:bg-gray-900 hover:border-gray-300 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-50"
            onClick={(e) =>
              handleSignup(e, { provider: "google", type: "oauth" })
            }
          >
            <GoogleLogo />
            <span>Continue with Google</span>
          </Button> */}

          <Messages />
        </CardContent>
        <CardFooter className="px-8">
          <p className="text-sm">
            By signing up, you agree to our{" "}
            <Link href="/tos" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
