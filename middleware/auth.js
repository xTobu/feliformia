export default async function ({ app, redirect, route }) {
  // 跳過登入頁面的檢查
  if (route.path === '/login' || route.path === '/reset-password') {
    return
  }

  // Client-side
  if (process.client) {
    const { data: { session } } = await app.$supabase.auth.getSession()

    if (!session) {
      return redirect('/login')
    }
  }

  // Server-side 也跳轉（第一次進入頁面時）
  if (process.server) {
    return redirect('/login')
  }
}
