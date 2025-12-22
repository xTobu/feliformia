import { createClient } from "@supabase/supabase-js";

export default async (context, inject) => {
  const { store, route, app } = context;

  const supabase = createClient(
    context.$config.supabaseUrl,
    context.$config.supabasePublicKey,
    {
      auth: {
        // 使用 cookie 儲存 session
        storage: {
          getItem: (key) => {
            if (process.client) {
              const value = document.cookie
                .split('; ')
                .find(row => row.startsWith(key + '='))
                ?.split('=')[1];
              return value ? decodeURIComponent(value) : null;
            }
            return null;
          },
          setItem: (key, value) => {
            if (process.client) {
              document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
            }
          },
          removeItem: (key) => {
            if (process.client) {
              document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
          }
        }
      }
    }
  );

  // 載入使用者 profile
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('loadProfile error:', error.message);
        store.dispatch('auth/setNickname', null);
        return;
      }

      store.dispatch('auth/setNickname', data?.nickname || null);
    } catch (err) {
      console.warn('loadProfile failed:', err);
      store.dispatch('auth/setNickname', null);
    }
  };

  // 不需要登入的頁面
  const publicPages = ['/login', '/reset-password'];

  // 初始化時檢查 session
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    store.dispatch('auth/setAuth', {
      user: session.user,
      session: session
    });
    loadProfile(session.user.id);

    if (route.path === '/login') {
      window.location.href = '/';
    }
  } else {
    if (!publicPages.includes(route.path)) {
      window.location.href = '/login';
      return;
    }
  }

  // 監聽認證狀態變化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    if (event === 'SIGNED_IN' && session) {
      store.dispatch('auth/setAuth', {
        user: session.user,
        session: session
      });
      loadProfile(session.user.id);
    }

    if (event === 'SIGNED_OUT') {
      store.dispatch('auth/clearAuth');
      window.location.href = '/login';
    }
  });

  inject("supabase", supabase);
};
