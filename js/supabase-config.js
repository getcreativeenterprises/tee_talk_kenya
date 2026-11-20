// Shared Supabase connection. Use the SAME project URL and anon key
// you already put into first-date.html — copy them from there, or from
// Supabase: Project Settings -> API.
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const backendConfigured = SUPABASE_URL.startsWith("http");
const sb = backendConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
