// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ceolmuwxnouiarkrsrrv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlb2xtdXd4bm91aWFya3JzcnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDc1OTksImV4cCI6MjA2NDcyMzU5OX0.uqoFzuDswdyjGu-VmiHUtFbxqSuzaltnC-bVpvUaIqQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);