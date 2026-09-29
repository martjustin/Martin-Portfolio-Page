# Portfolio V2.3 — Martin Azihaiwe-Justin (Flight theme)

A static, dependency-free site (plain HTML/CSS/JS, no build step). It's the original Flight design (drone hero, callouts, graphite dark zone, taxiing drone on the runway) with the V2 content re-told as a flight. The only third-party request is Calendly, and it loads only when someone clicks a booking button.

## Files
- `index.html` — the page, with SEO meta, Open Graph/Twitter cards and JSON-LD (Person, ProfessionalService, FAQPage)
- `style.css` — the original Flight stylesheet plus V2.1 components (checklist, route map, black box, pre-flight check)
- `script.js` — scroll reveals, hero parallax, mobile nav, checklist, AI release comparison, pre-flight check, copy email, mobile action bar, lazy Calendly
- `assets/` — drone images, avatar, résumé PDF, `og-image.png`, Geist + Geist Mono fonts (SIL Open Font License)
- `vercel.json`, `robots.txt`, `sitemap.xml`, `llms.txt`

## Deploy
Push to GitHub, import at vercel.com/new, framework preset **Other**, no build command. If your final domain isn't `martjustin.vercel.app`, find and replace it in `index.html`, `robots.txt`, `sitemap.xml` and `llms.txt`.

## Storyboard

| # | Section | Flight beat | What it does |
|---|---|---|---|
| 00 | Hero | Take-off | Drone, "Quality at altitude", and two equal flight plans: *See the flight log* (hiring) and *Run a pre-flight check* (clients) |
| — | Readouts | Instrument panel | 24+ hrs/wk regression automated · <4 min bug reports · 4 layers · 8+ yrs ops |
| 01 | Flight systems | Systems check | UI, API, Data, AI/LLM, each with Explore / Automate / Gate |
| 02 | Pre-flight checklist | Checklist | Five release checks (MAPPED, RATED, ARMED, LOGGED, SECURED). Visitors can tick items or run the list |
| 03 | Flight log | Logbook | E-commerce Automation Framework, BugReel Pro, Hotel Management suite |
| 04 | Flight path | Route | Waypoints OPS → SQA → AIQ, then the experience timeline. Brewery years are condensed into one "Operations foundation" entry |
| 05 | Black box | Flight recorder | AI-quality demo: the suite is green but v1.4 is off course; trust checks catch it |
| 06 | Proof | — | Quote, core stack and certifications |
| 07 | Engagements | Flight plan for clients | Four fixed-scope offers (no public prices), a scoping call, and the **pre-flight check**: 8 questions scored Grounded / Holding / Cleared, with a prefilled "Email me my results" |
| 08 | How I work | — | FAQ |
| 09 | Cleared for takeoff? | Landing / runway | Two doors (hiring vs projects), contact pills and the taxiing drone |

## Check before going live
- [ ] **Role title.** The site now uses one title everywhere: *Software Quality Assurance Engineer | Automation Test Engineer* (header, hero, page title, share cards, schema, footer and the OneFlare entry). Your résumé still says "Functional Test Analyst / QA Engineer"; update it and your LinkedIn headline to match.
- [ ] **Résumé PDF still lists your microbiology degrees.** The site no longer mentions them; update the PDF if you want the two to match.
- [ ] **24+ hours of manual regression.** V1 credited this to OneFlare ("per cycle"). The résumé credits it to the Hotel Management System framework ("per week"). V2.1 follows the résumé. Keep all three documents consistent.
- [ ] The **Hotel Management System** card has no link (private repo). Add one if it's public.
- [ ] Swap the "Read my posts on AI testing" link for the direct URL of your "green checkmark" post.
- [ ] Email and phone number are public in the page source, as before.
- [ ] When ISTQB CTFL is awarded, update the certifications row, `llms.txt` and the résumé.
