import { Database } from "./supabase";

// export type modelRow = Database["public"]["Tables"]["models"]["Row"];
// export type sampleRow = Database["public"]["Tables"]["samples"]["Row"];

// export type modelRowWithSamples = modelRow & {
//   samples: sampleRow[];
// };

// export type imageRow = Database["public"]["Tables"]["images"]["Row"];

// export type creditsRow = Database["public"]["Tables"]["credits"]["Row"];

export type LinksRow = Database["public"]["Tables"]["links"]["Row"];

export type PagesRow = Database["public"]["Tables"]["pages"]["Row"];

export type Interval = "1h" | "24h" | "7d" | "30d" | "90d" | "all" | undefined;