export async function onRequest(context) {
  const headers = { 
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });
  }

  try {
    const { email } = await context.request.json();
    
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers });
    }

    // Store in KV if available, otherwise just log
    // For now, forward to your email via a simple notification
    // The subscriber list grows in KV, you export when ready for Kit
    
    const timestamp = new Date().toISOString();
    
    // Try KV storage
    if (context.env.SUBSCRIBERS) {
      const existing = await context.env.SUBSCRIBERS.get('list') || '[]';
      const list = JSON.parse(existing);
      if (!list.find(s => s.email === email)) {
        list.push({ email, date: timestamp });
        await context.env.SUBSCRIBERS.put('list', JSON.stringify(list));
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Subscribed!' }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
