export default function (req, res, next) {
  // 解析 cookie
  const cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      cookies[name] = value;
    });
  }

  // 不需要登入的頁面
  const publicPages = ['/login', '/reset-password'];
  const isPublicPage = publicPages.some(page => req.url.startsWith(page));

  // 檢查是否有 session cookie
  const hasSession = Object.keys(cookies).some(key =>
    key.startsWith('sb-') && key.endsWith('-auth-token')
  );

  // 未登入且不是公開頁面 → 跳轉到登入頁
  if (!hasSession && !isPublicPage && !req.url.startsWith('/api') && !req.url.startsWith('/_nuxt')) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return;
  }

  next();
}
