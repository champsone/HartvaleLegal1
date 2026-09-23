/* HartvaleLegal | Supabase connection settings
   Fill these in from your Supabase project (Project settings -> API):
   - SUPABASE_URL is your project URL, e.g. https://abcdefgh.supabase.co
   - SUPABASE_ANON_KEY is the "anon public" key.
   The anon key is DESIGNED to be public. It cannot be used to write
   content on its own -- writes are only allowed for a signed-in admin
   account, enforced by Row Level Security policies in the database
   (see /supabase/setup.sql). Do not put a "service_role" key here. */
(function () {
  "use strict";
  window.SUPABASE_URL = "TODO_REPLACE_WITH_YOUR_SUPABASE_PROJECT_URL";
  window.SUPABASE_ANON_KEY = "TODO_REPLACE_WITH_YOUR_SUPABASE_ANON_KEY";

  window.getSupabaseClient = function () {
    if (!window.supabase || typeof window.supabase.createClient !== "function") return null;
    if (window.SUPABASE_URL.indexOf("TODO_") === 0 || window.SUPABASE_ANON_KEY.indexOf("TODO_") === 0) return null;
    if (!window.__hartvaleSupabaseClient__) {
      window.__hartvaleSupabaseClient__ = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return window.__hartvaleSupabaseClient__;
  };
})();
