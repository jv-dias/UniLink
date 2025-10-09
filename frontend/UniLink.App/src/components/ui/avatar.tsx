"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

// Render the default SVG inside the fallback by default (consumers can override)
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  // Use login-hero.jpg as background image
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-[0.75rem] font-medium bg-primary/10 text-primary",
        className
      )}
      {...props}
    />
  )
}

// A small default photo SVG, used by AvatarFallback when no image is provided.
function DefaultAvatarSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="128" height="128" rx="24" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0f0f0" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <g transform="translate(24,28)">
        <circle cx="40" cy="24" r="20" fill="#fff" opacity="0.9" />
        <rect x="0" y="56" width="80" height="20" rx="10" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  )
}

export { Avatar, AvatarImage, AvatarFallback, DefaultAvatarSVG }
