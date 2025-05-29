// accbak/laundry-day-dream/accbak-laundry-day-dream-e7edca62d8a70de63bff20cfe46310379eaa1ad5/app/services/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// It's good practice to ensure these are not undefined in a production build
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key is missing in environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Persist user session across app restarts
    autoRefreshToken: true,
  },
});