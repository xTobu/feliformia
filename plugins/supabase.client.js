import { createClient } from "@supabase/supabase-js";

export default (context, inject) => {
  const supabase = createClient(
    context.$config.supabaseUrl,
    context.$config.supabasePublicKey
  );

  inject("supabase", supabase);
};
