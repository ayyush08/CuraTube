import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatViews(views: number): string {
  if(!views) return "0 views";
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`
  }
  return `${views} view${views !== 1 ? "s" : ""}`
}