"use client";

import React, { useEffect, useState } from "react";
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

const formSchema = z.object({
  email: z
    .string({
      required_error: "Email is Required",
    })
    .email(),
});

export default function WaitlistForm({ saveWaitlistUser }: { saveWaitlistUser: any }) {
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

  return (
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
  );
}
