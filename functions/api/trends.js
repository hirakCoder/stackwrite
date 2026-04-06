export async function onRequest(context) {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  
  try {
    // Reddit hot posts (free, no auth)
    const subs = ['LocalLLaMA', 'ClaudeAI', 'programming', 'SideProject', 'iOSProgramming'];
    const redditPromises = subs.map(sub =>
      fetch(`https://old.reddit.com/r/${sub}/hot.json?limit=3`, {
        headers: { 'User-Agent': 'TrendRadar/1.0' }
      }).then(r => r.json()).catch(() => ({ data: { children: [] } }))
    );

    // GitHub trending (free, no auth)  
    const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
    const ghResp = await fetch(
      `https://api.github.com/search/repositories?q=created:>${weekAgo}&sort=stars&order=desc&per_page=8`,
      { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'TrendRadar/1.0' } }
    ).catch(() => null);

    const redditResults = await Promise.all(redditPromises);
    const reddit = redditResults.flatMap((r, i) =>
      (r.data?.children || [])
        .filter(p => !p.data.stickied)
        .map(p => ({
          sub: subs[i],
          title: p.data.title,
          score: p.data.score,
          comments: p.data.num_comments
        }))
    ).sort((a, b) => b.score - a.score).slice(0, 12);

    let github = [];
    if (ghResp?.ok) {
      const gh = await ghResp.json();
      github = (gh.items || []).slice(0, 8).map(r => ({
        name: r.full_name,
        stars: r.stargazers_count,
        desc: (r.description || '').substring(0, 80)
      }));
    }

    return new Response(JSON.stringify({ reddit, github, timestamp: new Date().toISOString() }), { headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
  }
}
