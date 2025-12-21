import { createClient } from "@supabase/supabase-js";

export default async (context, inject) => {
  const { store, route } = context;

  const supabase = createClient(
    context.$config.supabaseUrl,
    context.$config.supabasePublicKey
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

    // 已登入但在登入頁，跳到首頁
    if (route.path === '/login') {
      window.location.href = '/';
    }
  } else {
    // 未登入且不在公開頁面，跳到登入頁
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
