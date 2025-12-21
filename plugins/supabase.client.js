import { createClient } from "@supabase/supabase-js";

export default (context, inject) => {
  const { store } = context;

  const supabase = createClient(
    context.$config.supabaseUrl,
    context.$config.supabasePublicKey
  );

  // 載入使用者 profile（加入錯誤處理）
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('loadProfile error:', error.message);
        store.dispatch('auth/setNickname', null);  // 標記載入完成（無 nickname）
        return;
      }

      store.dispatch('auth/setNickname', data?.nickname || null);
    } catch (err) {
      console.warn('loadProfile failed:', err);
      store.dispatch('auth/setNickname', null);  // 標記載入完成
    }
  };

  // 監聽認證狀態變化
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth event:', event);

    if (event === 'SIGNED_IN' && session) {
      store.dispatch('auth/setAuth', {
        user: session.user,
        session: session
      });
      loadProfile(session.user.id); // 不用 await，背景執行
    }

    if (event === 'SIGNED_OUT') {
      store.dispatch('auth/clearAuth');
      window.location.href = '/login';
    }
  });

  // 初始化時檢查 session
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      store.dispatch('auth/setAuth', {
        user: session.user,
        session: session
      });
      loadProfile(session.user.id); // 不用 await，背景執行
    }
  });

  inject("supabase", supabase);
};
