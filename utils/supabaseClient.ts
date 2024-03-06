// utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const createFetch = (options: any) => (url: any, init: any) => {
  return fetch(url, {
    ...init,
    ...options,
  });
};

export const supabase = createClient(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string
  // {
  //   //TO BE REMOVED ON PRODUCTION
  //   global: {
  //     fetch: createFetch({
  //       cache: "no-store",
  //     }),
  //   },
  // }
);
