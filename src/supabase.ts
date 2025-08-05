import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Debug: Log Supabase configuration
console.log('Supabase configuration:', {
  url: supabaseUrl ? 'SET' : 'NOT SET',
  key: supabaseKey ? 'SET' : 'NOT SET',
});
