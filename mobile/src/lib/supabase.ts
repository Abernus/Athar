import { createClient } from "@supabase/supabase-js";

// ⚠️ Replace with your Supabase project values
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "⚠️ Supabase credentials missing. Create a .env file in mobile/ with:\n" +
      "EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\n" +
      "EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ..."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: "athar" },
});
