export async function onRequest(context) {
  const headers = { 'Content-Type': 'application/json' };
  
  // Simple auth check
  const cookie = context.request.headers.get('Cookie') || '';
  if (!cookie.includes('sw-auth=hirak2026')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
  }

  if (context.env.SUBSCRIBERS) {
    const list = await context.env.SUBSCRIBERS.get('list') || '[]';
    return new Response(list, { headers });
  }
  
  return new Response(JSON.stringify([]), { headers });
}
