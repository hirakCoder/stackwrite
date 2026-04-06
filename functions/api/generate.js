export async function onRequest(context) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  try {
    const { prompt, currentScript, trends } = await context.request.json();
    const apiKey = context.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured. Run: wrangler pages secret put ANTHROPIC_API_KEY' }), { status: 500, headers });
    }

    const systemPrompt = `You are a viral short-form video script writer for a faceless dev channel called ShipWithAI. The creator is Hirak — senior QA engineer, shipped DayDrop to App Store, builds with Claude Code.

Rules:
- Scripts are 55-60 seconds max
- Hook MUST grab in first 3 seconds (bold text overlay + voiceover)
- Flash-forward technique: show result first, then rewind
- Sound HUMAN not AI: use fragments, self-deprecation, specific details, humor
- Never say: dive into, explore, leverage, unlock, game-changer, revolutionize
- Format as timeline beats with: time, screen direction, text overlay, voiceover, edit notes
- Include hashtags at the end
- 70% of content should be value (no product mention), 20% entertainment, 10% product`;

    const userPrompt = currentScript 
      ? `Here's the current script:\n${currentScript}\n\nUser wants: ${prompt}\n\n${trends ? 'Current trends:\n' + trends : ''}\n\nRewrite the script with these changes. Keep the same timeline format.`
      : `${prompt}\n\n${trends ? 'Current trends to consider:\n' + trends : ''}\n\nWrite a complete 60-second video script in timeline format.`;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await resp.json();
    const content = data.content?.[0]?.text || 'Failed to generate. Try again.';
    
    return new Response(JSON.stringify({ script: content }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
