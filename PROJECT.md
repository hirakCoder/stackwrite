# stackwrite.com

## What This Is
A standalone tech publication focused on AI tools, vibe coding, apps (iOS/Android), GitHub repos, and developer productivity. Think iGeeksBlog but broader — covering everything builders care about.

## Business Model
1. Build SEO authority with high-quality, non-promotional content
2. Companies pay to have their tools featured ($200+ per listing)
3. Affiliate links for developer tools (ElevenLabs, Claude, etc.)
4. Newsletter sponsorships once subscriber base grows
5. Creates backlinks to Hirak's products (DayDrop, SwiftGenAI, SiteAuditAI) — but ONLY after trust is established (20-30 articles in, not from day 1)

## The Rule
DO NOT mention Hirak's products (DayDrop, SwiftGenAI, SiteAuditAI) in articles until the site has 20+ articles and organic traffic. The site must build trust as an independent publication first. Self-promotion kills credibility.

## Content Strategy
- 70% value content (tools, repos, hacks, deals, comparisons)
- 20% entertainment/opinion (hot takes, challenges, controversy)
- 10% product features (other people's tools first, own products much later)
- Monthly updated articles (promo codes page, tool comparisons)
- Cross-linked articles for internal SEO juice

## Content Pipeline Integration
Each article has a `status` field in frontmatter:
- `needs-video` — Article published, video not filmed yet (check /pipeline page)
- `published` — Both article and video live
- `research` — Too detailed for video, article only

Articles can embed YouTube videos via `youtubeId` frontmatter field.
Articles can link to TikTok via `tiktokUrl` frontmatter field.

The content flywheel:
- TrendRadar (at /DayCount/trendradar/) scans X, YouTube, Reddit, GitHub, TikTok daily
- Hot topics become both articles AND videos
- Articles embed videos, videos link to articles
- Topics too complex for 60-sec videos become article-only content
- The /pipeline page shows which articles still need videos

## Tech Stack
- Astro (static site generator — fastest, best SEO)
- Cloudflare Pages (hosting — free, unlimited bandwidth)
- Giscus (comments — GitHub Discussions powered, free)
- Kit / ConvertKit (newsletter — free up to 10,000 subscribers, NOT YET CONFIGURED)
- Domain: stackwrite.com (Namecheap, DNS pointed to Cloudflare)

## Deployment
- GitHub repo: github.com/hirakCoder/stackwrite
- Live at: https://stackwrite.pages.dev (custom domain pending DNS propagation)
- Auto-deploys: Push to main → Cloudflare Pages builds → live in ~30 seconds
- Manual deploy: `cd /Users/hirakbanerjee/stackwrite && npm run build && wrangler pages deploy dist --project-name stackwrite`

## Adding a New Article
1. Create `src/content/blog/your-slug-here.md`
2. Add frontmatter:
```yaml
---
title: "Your Title Here"
description: "Meta description for SEO (150 chars)"
pubDate: 2026-04-06
category: "AI Tools"  # Options: AI Tools, Vibe Coding, Apps, GitHub, Hacks, Deals
status: "needs-video"  # or "published" or "research"
tags: ["tag1", "tag2"]
youtubeId: ""  # Add YouTube video ID when filmed
tiktokUrl: ""  # Add TikTok URL when posted
---
```
3. Write the article in Markdown
4. `npm run build && wrangler pages deploy dist --project-name stackwrite`

## Current Articles (April 2026)
1. "15 AI Coding Hacks Nobody Talks About" — Hacks, needs-video
2. "Claude Code vs Cursor vs Copilot: Honest 2026 Comparison" — AI Tools, needs-video
3. "Every Free Credit & Promo Code for Dev Tools (April 2026)" — Deals, research (monthly update)
4. "What Is Vibe Coding? Complete 2026 Guide" — Vibe Coding, needs-video (evergreen SEO)
5. "10 GitHub Repos That Replace Paid Dev Tools" — GitHub, needs-video
6. "10 Best MCP Servers Every Developer Needs" — AI Tools, needs-video

## SEO Setup
- JSON-LD schema: Organization + Article on every page
- Open Graph + Twitter Card meta tags
- Sitemap auto-generated at /sitemap-index.xml
- robots.txt welcomes ALL crawlers including AI bots (GPTBot, Claude-Web, PerplexityBot, Applebot)
- Canonical URLs on every page
- Descriptive slugs (not IDs)

## Related Systems
- TrendRadar: /Users/hirakbanerjee/DayCount/trendradar/ — daily trend scanning
- ClipShip: /Users/hirakbanerjee/DayCount/clipship/ — one-command video posting
- Content Plan: /Users/hirakbanerjee/DayCount/content-plan.txt — 26 video scripts + calendar
- Mission Control: /Users/hirakbanerjee/DayCount/mission-control.html — personal dashboard

## Owner
Hirak Banerjee | hirak8 on X | hirakcoder on GitHub | stackwrite@beatroot.dev
