import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''; // URL DO SUPABASE
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''; // CHAVE DO SUPABASE

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);