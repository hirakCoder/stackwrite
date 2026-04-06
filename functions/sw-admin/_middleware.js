export async function onRequest(context) {
  const cookie = context.request.headers.get('Cookie') || '';
  const isAuthed = cookie.includes('sw-auth=hirak2026');
  const url = new URL(context.request.url);

  // Logout
  if (url.searchParams.get('logout') === '1') {
    return new Response('Logged out', {
      status: 302,
      headers: {
        'Set-Cookie': 'sw-auth=; Max-Age=0; Path=/sw-admin; HttpOnly; Secure; SameSite=Strict',
        'Location': '/'
      }
    });
  }

  // Login page
  if (url.pathname === '/sw-admin/login') {
    if (context.request.method === 'POST') {
      const form = await context.request.formData();
      const pass = form.get('password');
      const correctPass = context.env.ADMIN_PASSWORD || 'stackwrite2026';

      if (pass === correctPass) {
        return new Response('', {
          status: 302,
          headers: {
            'Set-Cookie': 'sw-auth=hirak2026; Max-Age=604800; Path=/sw-admin; HttpOnly; Secure; SameSite=Strict',
            'Location': '/sw-admin/scripts.html'
          }
        });
      }
      return new Response(loginPage('Wrong password'), { headers: { 'Content-Type': 'text/html' } });
    }
    return new Response(loginPage(), { headers: { 'Content-Type': 'text/html' } });
  }

  // Redirect to login if not authed
  if (!isAuthed) {
    return new Response('', {
      status: 302,
      headers: { 'Location': '/sw-admin/login' }
    });
  }

  return context.next();
}

function loginPage(error) {
  return `<!DOCTYPE html><html><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>Admin — stackwrite.com</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,system-ui,sans-serif;background:#08080c;color:#e4e4ed;
      display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
    .card{background:#111118;border:1px solid #1e1e28;border-radius:20px;padding:40px;
      max-width:360px;width:100%;text-align:center}
    h1{font-size:20px;font-weight:700;margin-bottom:6px}
    p{font-size:13px;color:#555;margin-bottom:24px}
    input{width:100%;padding:14px 16px;background:#0a0a10;border:1px solid #2a2a34;
      border-radius:10px;color:#e4e4ed;font-size:16px;outline:none;margin-bottom:12px;
      font-family:inherit;text-align:center;letter-spacing:2px}
    input:focus{border-color:#7c6cff}
    button{width:100%;padding:14px;background:linear-gradient(135deg,#7c6cff,#a855f7);
      border:none;border-radius:10px;color:white;font-weight:600;font-size:15px;cursor:pointer}
    .error{color:#ef4444;font-size:13px;margin-bottom:12px}
  </style></head><body>
  <form class="card" method="POST">
    <h1>stackwrite.com</h1>
    <p>Admin access</p>
    ${error ? '<div class="error">' + error + '</div>' : ''}
    <input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password">
    <button type="submit">Enter</button>
  </form></body></html>`;
}
