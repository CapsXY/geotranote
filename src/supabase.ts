import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing in .env file.');
  throw new Error('Supabase URL or Key is missing in .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.getSession()
  .then(() => {
    console.log('Supabase connection successful!');
  })
  .catch((error) => {
    console.error('Supabase connection failed:', error);
    if (error.message.includes('404')) {
      console.error('Supabase connection failed with 404 error. Please check your Supabase URL.');
    }
    console.error('Supabase connection error details:', error);
  });

export default supabase;
