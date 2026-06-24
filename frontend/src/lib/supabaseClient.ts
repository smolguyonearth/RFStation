import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const isServer = typeof window === 'undefined';

const supabaseKey = isServer 
    ? import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
    : import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);