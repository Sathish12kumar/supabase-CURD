import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publickey = import.meta.env.VITE_SUPABASE_PUBLICKEY;
export const supabase = createClient(url, publickey);
