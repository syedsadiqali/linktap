"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const avatarSizes = cva(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-base-content/20",
  {
    variants: {
      variant: {
        sm: "w-[30px] h-[30px]",
        md: "w-[45px] h-[45px]",
        lg: "w-[60px] h-[60px]",
        xl: "w-[80px] h-[80px]",
        xxl: "w-[120px] h-[120px]"
      },
    },
    defaultVariants: {
      variant: "sm",
    },
  }
);

export interface AvatarPropsWithRef
  extends React.ElementRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarSizes> {}

export interface AvatarPropsWithoutRef
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarSizes> {}

const Avatar = React.forwardRef<AvatarPropsWithRef, AvatarPropsWithoutRef>(
  ({ className, variant, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarSizes({ variant }), className)}
      {...props}
    />
  )
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
