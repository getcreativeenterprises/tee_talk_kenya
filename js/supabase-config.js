// Shared Supabase connection. Use the SAME project URL and anon key
// you already put into first-date.html — copy them from there, or from
// Supabase: Project Settings -> API.
const SUPABASE_URL = "https://muaxphjtapxcdwersbxh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_FCsxKGFcONm3i240q4kB7Q_x4Jo2txN";

const backendConfigured = SUPABASE_URL.startsWith("http");
const sb = backendConfigured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
