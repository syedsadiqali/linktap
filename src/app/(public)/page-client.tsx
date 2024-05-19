"use client";

import React, { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/background-beams";
import { HoverBorderGradient } from "@/components/hover-button-graident";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is Required",
    })
    .email(),
});

function PageClient({ saveWaitlistUser }: { saveWaitlistUser: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (values?.email) {
      const { waitlistDetails, waitlistError } = await saveWaitlistUser(
        values?.email
      );

      if (waitlistError) {
        // form.setError("email", {
        //   type: "custom",
        //   message: waitlistError?.message,
        // });
        toast({
          title: "Error",
          description:
            waitlistError?.code === "23505"
              ? "Looks like you're already there!"
              : waitlistError?.message,
        });
      } else {
        toast({ title: "Success", description: "You're on the Waitlist!" });
        form.reset({ email: "" });
      }
      setIsLoading(false);
      // revalidateCache("/", true);
    }
  }

  const [oldTheme, setOldTheme] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // const pathname = usePathname();

  useEffect(() => {
    if (theme && theme !== "dark") {
      setOldTheme(theme);
      setTheme("dark");
    }

    return () => {
      if (oldTheme) {
        setTheme(oldTheme as string);
      }
    };
  }, [theme]);

  return (
    <div>
      <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
        <div className="absolute top-[20px]  z-[11]">
          <Link href="/login">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="bg-black  text-white flex items-center space-x-2"
            >
              <span>Login (Alpha)</span>
            </HoverBorderGradient>
          </Link>
        </div>
        <div className="max-w-2xl mx-auto p-4 z-[11]">
          <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-6xl text-white text-center">
            Join the Waitlist
          </h1>
          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
            Welcome to LinkTap, the open source Link In Bio Tool.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="hi@zuck.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="flex mt-2 mx-auto"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <BackgroundBeams />
      </div>
    </div>
  );
}

PageClient.theme = "dark";

export default PageClient;
