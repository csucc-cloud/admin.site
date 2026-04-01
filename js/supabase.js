// Initialize Supabase
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null) || 'https://your-project.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null) || 'your-anon-key';

export const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
