export async function onRequest(context) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: { ...headers, 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  try {
    const xaiKey = context.env.XAI_API_KEY;
    const ytKey = context.env.YOUTUBE_API_KEY;

    // Parallel: Reddit + GitHub + xAI X search + YouTube
    const [redditData, githubData, xData, ytData] = await Promise.all([
      // Reddit (free)
      Promise.all(
        ['LocalLLaMA','ClaudeAI','programming','SideProject','iOSProgramming'].map(sub =>
          fetch(`https://old.reddit.com/r/${sub}/hot.json?limit=3`, {
            headers: { 'User-Agent': 'TrendRadar/1.0' }
          }).then(r => r.json()).catch(() => ({ data: { children: [] } }))
        )
      ),
      
      // GitHub (free)
      fetch(
        `https://api.github.com/search/repositories?q=created:>${new Date(Date.now()-7*864e5).toISOString().split('T')[0]}&sort=stars&order=desc&per_page=8`,
        { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'TrendRadar/1.0' } }
      ).then(r => r.json()).catch(() => ({ items: [] })),
      
      // X/Twitter via xAI (real-time)
      xaiKey ? fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${xaiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'grok-3-mini',
          messages: [{
            role: 'user',
            content: 'What are the top 10 most viral and engaged posts on X/Twitter RIGHT NOW (last 6 hours) about: AI coding, claude code, vibe coding, indie dev, MCP servers, developer tools? For each post give: poster handle, what they said (brief), likes/reposts, and why it is trending. Be specific with real current data. Format as a numbered list.'
          }]
        })
      }).then(r => r.json()).catch(() => null) : null,
      
      // YouTube trending (free with key)
      ytKey ? Promise.all(
        ['claude code', 'vibe coding', 'ai coding tools'].map(q =>
          fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&order=viewCount&publishedAfter=${new Date(Date.now()-3*864e5).toISOString()}&maxResults=3&key=${ytKey}`)
            .then(r => r.json()).catch(() => ({ items: [] }))
        )
      ) : null
    ]);

    // Parse Reddit
    const subs = ['LocalLLaMA','ClaudeAI','programming','SideProject','iOSProgramming'];
    const reddit = redditData.flatMap((r, i) =>
      (r.data?.children || []).filter(p => !p.data?.stickied).map(p => ({
        sub: subs[i], title: p.data.title, score: p.data.score, comments: p.data.num_comments
      }))
    ).sort((a, b) => b.score - a.score).slice(0, 12);

    // Parse GitHub
    const github = (githubData.items || []).slice(0, 8).map(r => ({
      name: r.full_name, stars: r.stargazers_count, desc: (r.description || '').substring(0, 80)
    }));

    // Parse X/Twitter
    const xPosts = xData?.choices?.[0]?.message?.content || 'X search unavailable';

    // Parse YouTube
    let youtube = [];
    if (ytData) {
      const videoIds = ytData.flatMap(r => (r.items || []).map(i => i.id?.videoId)).filter(Boolean);
      if (videoIds.length && ytKey) {
        const statsResp = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds.join(',')}&key=${ytKey}`
        ).then(r => r.json()).catch(() => ({ items: [] }));
        youtube = (statsResp.items || []).map(v => ({
          title: v.snippet?.title, channel: v.snippet?.channelTitle,
          views: parseInt(v.statistics?.viewCount || 0), id: v.id
        })).sort((a, b) => b.views - a.views).slice(0, 10);
      }
    }

    return new Response(JSON.stringify({ 
      reddit, github, xPosts, youtube,
      timestamp: new Date().toISOString() 
    }), { headers });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
