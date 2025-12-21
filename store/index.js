export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtClientInit({ dispatch }, { app }) {
    // 在 client 端初始化時檢查登入狀態
    if (process.client && app.$supabase) {
      const { data: { session } } = await app.$supabase.auth.getSession()
      if (session) {
        dispatch('auth/setAuth', {
          user: session.user,
          session: session
        })
      }
    }
  }
}
