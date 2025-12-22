// middleware.js for vercel
export default function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 不需要登入的頁面
  const publicPages = [
    '/login',
    '/reset-password'
  ];

  // 跳過靜態資源和 API
  if (
    pathname.startsWith('/_nuxt') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/__nuxt') ||
    pathname.includes('.') ||
    publicPages.includes(pathname)
  ) {
    return;
  }

  // 檢查 cookie 是否有 session
  const cookies = request.headers.get('cookie') || '';
  const hasSession = cookies.includes('sb-') && cookies.includes('-auth-token');

  // 未登入 → 跳轉到登入頁
  if (!hasSession) {
    return Response.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_nuxt|api|.*\\..*).*)'],
};
