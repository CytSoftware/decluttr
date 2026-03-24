# Decluttr — Business Plan

## Executive Summary

**Decluttr** is a free, open-source, cross-browser extension with a Tinder-style swipe UI for triaging open tabs. Target: knowledge workers (developers, researchers, writers, analysts) who chronically accumulate 30-100+ tabs.

**Strategy**: Growth-first. Ship free and open source, build audience and credibility, then introduce a one-time paid Pro upgrade once there's meaningful traction.

**Brand**: Standalone product, loosely affiliated with CytSoftware.

---

## Target Audience

### Primary: Knowledge Workers
- Software developers (20-50 tabs across projects, docs, Stack Overflow, GitHub)
- Researchers and academics (papers, citations, reference material)
- Writers and content creators (research tabs, CMS, reference)
- Analysts (dashboards, data sources, reports)

### Why them?
- High tab counts (the problem is acute)
- Comfortable installing extensions
- Active in communities where word-of-mouth spreads (Reddit, HN, Twitter/X)
- Willing to pay for tools that save time
- Value open source (builds trust)

### User persona
> "I have 47 tabs open right now. I know I should close most of them but I'm afraid I'll lose something important. I've tried OneTab but I just end up with a massive list I never revisit."

---

## Competitive Landscape

| Competitor | Model | Weakness Decluttr exploits |
|---|---|---|
| **OneTab** | Free | Turns tabs into a static list you never revisit. No decision-forcing UI. |
| **Tab Wrangler** | Free/OSS | Auto-closes inactive tabs. No user agency — feels like losing control. |
| **Workona** | Freemium | Workspace manager, not a cleanup tool. Heavy, complex UI. |
| **Toby** | Freemium | Tab organizer focused on collections. Doesn't help you *close* tabs. |
| **Session Buddy** | Free | Saves/restores sessions. Doesn't help you decide what to keep. |

**Decluttr's moat**: The swipe UX. No competitor uses a decision-forcing, gamified interface. Every other tool is either a list (decision fatigue) or automatic (no user control). Decluttr is the only tool that makes the *decision process* fun and fast.

---

## Open Source Strategy

### License: MIT
- Maximum adoption — no friction for contributors, forks, or corporate use
- Builds trust with developer audience (they'll read the code)
- GitHub stars = social proof = discoverability

### What open source gives you (for free):
1. **SEO**: GitHub repos rank well. "open source tab manager" searches
2. **Trust**: Users can audit the code (critical for a browser extension with `tabs` + `<all_urls>` permissions)
3. **Contributions**: Bug fixes, translations, feature PRs from the community
4. **Distribution**: Listed on awesome-lists, open source directories, GitHub Explore
5. **Content**: "I built an open source Tinder for browser tabs" is a better story than "I made a tab manager"

### What to keep closed (for future Pro):
- Cloud sync backend
- Analytics dashboard
- Team/shared features
- Any server-side infrastructure

The extension itself stays fully open source and functional without Pro features.

---

## Monetization Plan

### Phase 1: Free (Months 0-6)
- 100% free, no restrictions
- Build user base, collect feedback, iterate
- Goal: 1,000-5,000 active users

### Phase 2: Introduce Pro (Month 6+)
- **One-time purchase: $9.99** (no subscription fatigue)
- Unlock via a license key (simple Gumroad or LemonSqueezy checkout)
- Pro features (to be developed based on user demand):
  - Session history (log of past decluttering sessions)
  - Cross-device sync (via a simple backend)
  - Advanced stats (tabs closed lifetime, streaks, insights)
  - Custom rules (auto-close tabs from X domain after Y days)
  - Priority support
  - "Pro" badge in the extension (vanity)

### Why one-time purchase?
- Knowledge workers have subscription fatigue ($5/mo for everything adds up)
- One-time feels like a fair deal for a utility tool
- Lower friction = higher conversion
- Can still do "pay what you want" above $9.99

### Revenue projections (conservative)
| Users | Conversion | Revenue |
|---|---|---|
| 5,000 | 2% (100) | $999 |
| 10,000 | 3% (300) | $2,997 |
| 50,000 | 3% (1,500) | $14,985 |

Even modest numbers cover costs. At 50K users, it's meaningful side income.

---

## Publishing to Stores

### Chrome Web Store
- **Fee**: $5 one-time developer registration
- **Review time**: 1-7 business days (usually 2-3)
- **Key risks**:
  - `<all_urls>` permission will trigger a more thorough review. Justify it clearly: "Required to generate tab metadata across all open tabs"
  - Single-purpose policy: Decluttr clearly does one thing (tab management). Good.
  - No remote code execution — all code is bundled. Good.
- **Listing optimization**:
  - Title: "Decluttr — Swipe to Declutter Your Tabs"
  - 5 screenshots showing: card UI, swipe action, summary screen, settings, keyboard shortcuts
  - Short description (132 chars): "Tinder-style tab manager. Swipe left to close, right to keep. Clean up 50 tabs in 60 seconds."
  - Detailed description: Features, keyboard shortcuts, privacy policy, open source link

### Firefox Add-ons (AMO)
- **Fee**: Free
- **Review time**: 1-5 days (often faster than Chrome)
- **Key differences**:
  - Source code may be requested (no problem — it's open source)
  - Slightly different review criteria but generally more lenient
  - `<all_urls>` less scrutinized on Firefox

### Submission checklist
- [ ] Chrome Web Store developer account ($5)
- [ ] Firefox Add-on developer account (free)
- [ ] Privacy policy page (host on landing page)
- [ ] 5 store screenshots (1280x800 or 640x400)
- [ ] Promo images: small tile (440x280), large tile (920x680), marquee (1400x560)
- [ ] Store descriptions (short + detailed)
- [ ] Build zip files (`pnpm --filter @decluttr/extension package:all`)

### Timeline to live
- Day 1: Submit to both stores
- Day 2-5: Firefox likely approved
- Day 3-7: Chrome likely approved
- Day 7: Both live, start marketing push

---

## Domain & Landing Page

### Domain recommendations (check availability)
| Domain | Price (approx) | Vibe |
|---|---|---|
| `decluttr.app` | ~$14/yr | Clean, modern, app-focused |
| `decluttr.io` | ~$30/yr | Dev-tool energy |
| `decluttr.dev` | ~$12/yr | Developer-first |
| `getdecluttr.com` | ~$12/yr | Safe bet, action-oriented |
| `usedecluttr.com` | ~$12/yr | Clear CTA in the domain |

**Recommendation**: `decluttr.app` — it's short, memorable, and the `.app` TLD signals a modern tool. Falls within the $20-100 budget.

### Landing page (already built, needs polish)
Current: Basic sections (Hero, How It Works, Features, Install CTA, Footer)

**Enhancements before launch**:
- Add a 30-second auto-playing demo GIF/video in the hero section
- Add social proof section (GitHub stars count, "open source" badge)
- Add a "Privacy" section: "We never see your tabs. Everything stays in your browser."
- Add store badges (Chrome Web Store, Firefox Add-ons) once approved
- Add a "Built with" or "Open Source" section linking to GitHub
- SEO: proper meta tags, Open Graph images, structured data

### Hosting (free)
- **Vercel** (free tier): Auto-deploy from GitHub, custom domain, SSL
- Or **GitHub Pages**: Free, simple, already in the repo

---

## Marketing & Launch Strategy

### The Discovery Problem (your #1 concern)
You're starting from zero audience. Here's the playbook to fix that.

### Pre-launch (Week 1)
1. **GitHub repo goes public** — clean README with GIF demo, badges, features list
2. **Create accounts**: Twitter/X, Reddit (if not already), Product Hunt
3. **Record a 30-second demo video** — screen recording of the swipe UI in action
4. **Write the launch post** — draft for Hacker News, Reddit, Product Hunt

### Launch Day (Week 2)
Execute these in order, ideally on a **Tuesday or Wednesday morning** (peak engagement):

#### 1. Product Hunt Launch
- **Critical for first users**
- Title: "Decluttr — Tinder for your browser tabs"
- Tagline: "Swipe left to close, right to keep. Declutter 50 tabs in 60 seconds."
- Include: demo GIF, 3 screenshots, link to extension + GitHub
- Ask: Rally anyone you know to upvote in the first 2 hours (PH algorithm favors early velocity)
- Goal: Top 10 of the day = 500-2000 visitors

#### 2. Hacker News "Show HN"
- Title: "Show HN: I built a Tinder-style UI to declutter browser tabs (open source)"
- HN loves: open source, novel UX ideas, solo dev stories
- Link directly to GitHub (HN prefers GitHub over marketing pages)
- Be active in comments — answer every question
- Goal: Front page = 5,000-20,000 visitors in 24 hours

#### 3. Reddit posts (same day)
- r/productivity (2.6M members): "I built a free tool to swipe through and close browser tabs like Tinder"
- r/webdev (2.1M): "Show r/webdev: Open source browser extension with a Tinder-style swipe UI"
- r/chrome (200K): "Free extension to declutter your tabs with a swipe UI"
- r/firefox (200K): Same angle
- **Rule**: Don't be spammy. Lead with the problem ("I had 80 tabs open..."), show the solution, link to GitHub

#### 4. Twitter/X thread
- "I built Tinder for browser tabs. Here's the story: 🧵"
- Thread structure: Problem → Idea → Demo GIF → Tech stack → Open source → Link
- Tag relevant people: indie hackers, dev tool creators, productivity influencers
- Use hashtags: #buildinpublic #opensource #productivity #webdev

### Post-launch (Weeks 3-8)
Ongoing content cadence (5-10 hrs/week):

| Day | Activity | Platform |
|---|---|---|
| Monday | Share a user testimonial or screenshot | Twitter/X |
| Wednesday | Short tip video (30-60s) | TikTok, YouTube Shorts, Twitter |
| Friday | Dev log / changelog update | Twitter thread, GitHub release |

### Content Ideas (video + writing)

#### Short videos (30-60 seconds) — highest ROI
1. "Watch me close 50 tabs in 60 seconds" — satisfying speed run
2. "The tab hoarder intervention" — comedic POV of someone with 200 tabs
3. "Keyboard shortcuts you didn't know you needed" — J/K/U demo
4. "Before and after" — tab bar before (chaotic) vs. after (clean)
5. "I built Tinder for tabs" — origin story, 60 seconds

#### Blog posts / threads
1. "Why I made my browser extension open source" — developer trust angle
2. "The psychology of tab hoarding" — thought leadership, SEO
3. "How I built a cross-browser extension with React + Vite" — technical tutorial, SEO
4. "Decluttr launch retrospective" — indie hacker community loves these

#### Ongoing SEO content (landing page blog)
- "Best tab management extensions 2026" — rank for comparison searches
- "How to close all tabs at once on Chrome" — rank for problem searches
- "Tab hoarding: why you do it and how to stop" — rank for awareness searches

### Free distribution channels
| Channel | Effort | Potential |
|---|---|---|
| Product Hunt | High (1 day) | 500-2,000 users |
| Hacker News | Medium (1 post) | 1,000-20,000 users |
| Reddit (multiple subs) | Medium | 200-2,000 users |
| GitHub trending | Low (good README) | 500-5,000 stars |
| Chrome Web Store SEO | Low (good listing) | Ongoing organic |
| Twitter/X viral content | High (ongoing) | Variable, compounding |
| Dev newsletters (TLDR, etc.) | Low (submit) | 100-1,000 users |
| awesome-browser-extensions lists | Low (PR) | Ongoing organic |

---

## Content Production Playbook

### Equipment needed (free/minimal)
- **Screen recording**: OBS (free) or macOS built-in (Cmd+Shift+5)
- **Video editing**: CapCut (free), DaVinci Resolve (free), or iMovie
- **Thumbnails**: Figma (free) or Canva (free)
- **GIFs**: Gifski (free, macOS) or CloudConvert

### Demo video script (30 seconds)
```
[Screen: browser with 40+ tabs]
"47 tabs. We've all been there."

[Click Decluttr icon, UI opens]
"Decluttr turns it into this."

[Swipe left on a few tabs — they fly off]
"Swipe left to close..."

[Swipe right on a tab]
"...right to keep."

[Summary screen appears]
"Done in 60 seconds. Free and open source."

[Show URL]
"decluttr.app"
```

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Chrome store rejection | Medium | Clear permission justification, privacy policy, no remote code |
| No one finds it | High (default) | Multi-channel launch (PH + HN + Reddit + Twitter on same day) |
| Competitors copy the swipe UI | Low-Medium | First-mover advantage, open source community, iterate faster |
| Users install but don't retain | Medium | Make first session delightful, add subtle reminders ("You have 30+ tabs, time to decluttr?") |
| Permission concerns (`<all_urls>`) | Medium | Open source = auditable code. Privacy section on landing page. |
| Low conversion to paid | Expected | One-time purchase is low-friction. Don't need high conversion at scale. |

---

## 90-Day Roadmap

### Week 1-2: Launch Prep
- [ ] Polish landing page (demo GIF, privacy section, SEO meta tags)
- [ ] Purchase domain
- [ ] Deploy landing page to Vercel
- [ ] Write privacy policy
- [ ] Create store listings (screenshots, descriptions)
- [ ] Submit to Chrome Web Store + Firefox Add-ons
- [ ] Push repo to GitHub (public), polish README with demo GIF
- [ ] Record 30-second demo video
- [ ] Draft launch posts (PH, HN, Reddit, Twitter)

### Week 2-3: Launch
- [ ] Product Hunt launch (Tuesday/Wednesday)
- [ ] Hacker News "Show HN" (same day or next day)
- [ ] Reddit posts across 4-5 subreddits
- [ ] Twitter/X launch thread
- [ ] Submit to dev newsletters (TLDR, Changelog, etc.)
- [ ] Submit PR to awesome-browser-extensions lists

### Week 4-8: Iterate & Grow
- [ ] Respond to ALL feedback (GitHub issues, store reviews, Reddit comments)
- [ ] Ship 2-3 quick improvements based on user feedback
- [ ] Weekly content: 1 short video + 1 tweet thread
- [ ] Monitor Chrome Web Store analytics (installs, uninstalls, ratings)
- [ ] Add onboarding flow (first-time tutorial)
- [ ] SEO blog posts on landing page

### Month 2-3: Consolidate
- [ ] Reach 1,000+ users
- [ ] Collect testimonials
- [ ] Explore Pro features based on most-requested items
- [ ] Build email list (newsletter signup on landing page)
- [ ] Consider a v2 with the top 3 requested features

---

## Key Metrics to Track

| Metric | Tool | Target (90 days) |
|---|---|---|
| Chrome Web Store installs | CWS dashboard | 1,000+ |
| Firefox Add-on installs | AMO dashboard | 200+ |
| GitHub stars | GitHub | 500+ |
| Weekly active users | CWS dashboard | 300+ |
| Uninstall rate | CWS dashboard | < 30% |
| Landing page visitors | Vercel Analytics (free) | 5,000+ |
| Store rating | CWS / AMO | 4.5+ stars |

---

## Budget Breakdown

| Item | Cost |
|---|---|
| Chrome Web Store developer fee | $5 (one-time) |
| Domain (`.app` or `.dev`, 1 year) | $12-30 |
| Hosting (Vercel free tier) | $0 |
| Video production (OBS + CapCut) | $0 |
| Design (Figma free) | $0 |
| **Total** | **$17-35** |

Everything else is sweat equity. Well within the $20-100 budget.

---

## Decision Log

| Decision | Rationale |
|---|---|
| Fully open source (MIT) | Builds trust with dev audience, GitHub discoverability, community contributions |
| One-time purchase for Pro | Matches audience preference (no subscription fatigue), low friction |
| Knowledge workers first | Highest tab counts, active in viral communities (HN, Reddit, Twitter) |
| Growth before monetization | Need 1K+ users before Pro makes sense. Free removes all friction. |
| Multi-channel launch day | Starting from zero audience — need to hit every channel simultaneously |
| Standalone brand | Decluttr has a stronger story alone than as "CytSoftware's extension" |
| 1-2 week timeline | Fast enough to maintain momentum, enough time to polish |

---

*Last updated: 2026-03-24*
