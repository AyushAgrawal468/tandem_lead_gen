# Tandem Web Funnel: Design Brief for AI Design Tools

> Saved copy of the Google Doc (Nov 19, 2026), taken 2026-11-20.
> Live source: https://docs.google.com/document/d/1U-FHx_XgkyE5gOmUE4KS09MErRS2oc15E_mR1kC0LhA/edit
> The Build Handoff remains the source of truth for logic, API and copy. This brief covers how it looks and moves. If the two disagree on copy, the handoff wins. If this copy and the live doc disagree, the live doc wins.

## How to use this doc
Use Higgsfield for imagery and motion. Use a code-capable design tool for the screens. Higgsfield's design generator produces UI mockups as pictures, not working code. A picture of a swipe deck can't show drag behaviour, keyboard focus or the 35-swipe counter, and Ayush can't build from pixels.

| Job | Tool | Output |
| :- | :- | :- |
| Screens, components, states, responsive layouts | Claude Design, or Claude Code with the frontend-design skill on the repo | HTML/React that Ayush can lift straight into lead-form-frontend |
| Placeholder poster art for mockups, hero loop video, reel stills, OG images | Higgsfield (image and motion) | PNG/WebP/MP4 assets |
| Optional mood boards before screens | Higgsfield design generator, UI style | Images for direction only, never handed to Ayush as spec |

How to feed a tool:
1. Paste sections 1 to 5 of this doc as context.
2. Paste one prompt from section 6 or 7.
3. Attach the Tandem design system image and 3 or 4 app screenshots for the look, and the earlier mockups for layout and flow only: [Tandem Web Funnel: Screen Mockups](https://claude.ai/artifact/TacbKpdcjYmy6J6fepEz6U).
4. Generate one screen at a time. A tool asked for all screens at once gives you shallow versions of each.

## 1. Product and audience
Tandem is a social planning app in Bengaluru and Mumbai: you swipe on real events, and when a friend from your contacts swipes right on the same one, you both get matched and go together. The web funnel lets people try that swiping without installing anything, then hands them to the app.
- **Who arrives:** Young urban adults [confirm age band] coming from Instagram reels by the creator Sukalyan, from a friend's WhatsApp link, or from Google and AI search.
- **Their device:** mostly Android phones on mid-range hardware and patchy 4G. Desktop must work fully too, including swiping.
- **The one job of the design:** make the first swipe happen within 3 seconds of landing, before any sign-up ask.
- **The feeling:** a night-out plan forming between friends. A crowd of real options, picked with your thumb. Not a dating app, not a ticketing marketplace.

## 2. Visual system: the Tandem app theme
The web must look like the app, so a visitor who installs feels no jump. Values come from the Tandem app design system file (colour, type, iconography and form states). Surface greys not named in that file were sampled from it and are marked "sampled". The design system file wins over anything else in this doc.

**Colour**

| Token (app name) | Hex | Use on the web |
| :- | :- | :- |
| Bg-color | #111111 | Page background everywhere |
| Yellow | #C1F546 | Section labels, the ring on round add buttons, calendar icon. Sparingly |
| Green | #00FFC8 | Called "mint" elsewhere. Round send/action button, active nav state and its glow, "I'm in" drag label, progress bar, links |
| Purple | #8349FF | Confirmed by Shreyas. Selected chips, avatar strip on cards, send/location icon |
| success | #6FD461 | Saved, verified, waitlist joined |
| fail | #F3543F | Errors, wrong code, destructive buttons, "Never" drag label |
| Text High | #F2F2F2 | Headings and primary text |
| Text Mid | #BCBCBC | Body and secondary text |
| Text Low | #969696 | Captions, placeholders, meta lines |
| Surface 1 (sampled) | #252525 | Cards, sheets, large text areas |
| Surface 2 (sampled) | #414141 | Inputs, code boxes, unselected chips, small round icon buttons |
| Error fill (sampled) | #221615 | Background of an input in error |

**Type**
- One family: **Anek Latin**. The design file samples render at an expanded width, so load Anek Latin with its width axis and match the samples [confirm the width value with the designer].
- The app scale (Heading 24, Body 14, Caption 10) is for a phone app. The web uses the scale below: same family and weights, larger where the web has a hero, long reading or form fields.

| Web style | Phone (390 px) | Desktop (1440 px) | Line height | Weight | Use | App equivalent |
| :- | :- | :- | :- | :- | :- | :- |
| Display | 40 px | 56 px | 110% | Bold | Homepage and city page headline | None |
| Title | 28 px | 36 px | 115% | Bold | Full-screen headlines: match, hard stop, end of deck, FAQ and homepage section headings | None |
| Heading | 22 px | 24 px | 120% | Bold | Sheet and modal headlines, event title on the details page | Heading-B 24 |
| Card title | 18 px | 20 px | 125% | Bold | Event title on cards | Heading-B, smaller |
| Body | 16 px | 16 px | 150% | Regular | Paragraphs, FAQ answers, sheet body, all input text | Body-R 14, larger |
| Body small | 14 px | 14 px | 150% | Regular and Bold | Card meta lines, toasts, banners, chips | Body-R / Body-B 14 |
| Button | 16 px | 16 px | 100% | Bold | All buttons | Body-B 14, larger |
| Caption | 12 px | 12 px | 150% | Regular and Bold | Consent line, key hints, footer, counter | Caption 10, larger |

- Input text is 16 px minimum (below that, iPhone Safari zooms on focus).
- Nothing on the web goes below 12 px.
- Section labels use Yellow on the background.
- Sentence case. Prices as "₹ 1200/person".

**Logo and icons**
- The logo is a round orb with a lime to mint to violet gradient. The Play Store icon is a violet scribble mark on black. Use the orb for the web header and favicon unless told otherwise [confirm which mark the web uses].
- Icons: thin line icons in Text High for search, back, menu, calendar. Round filled action icons with a soft glow: calendar on Yellow, send on Purple, share on Green. Category icons sit in glowing round badges.
- The app's bottom nav is not used on the web; the web has no tabs.

**Form states**
- Input: Surface 2 fill, ~8 px radius, Text Low placeholder. Focused: 1 px light border. Filled: Text High value. Error: fail border, Error fill, fail-coloured value and message under the field.
- Code entry: **4 square boxes** in Surface 2. Filled: Text High digits. Error: fail borders and digits, "Incorrect OTP" style message under them.
- Chips: pill, Surface 2 unselected, Purple selected with white text.
- Buttons: white pill with near-black text for the main action; fail-red pill for destructive; round Green button with a dark arrow for send. Secondary ("Not now", "Later"): Surface 2 pill with Text High.

**The event card (match the app's Discover card)**
- Rounded dark card, ~16 px radius, on the near-black background.
- Violet strip across the top: stacked friend avatars plus "are interested". On the web show it only on Journey 2 ("{sender} is in"); hide on cold decks.
- Poster image, then bold white title, grey "{day}, time · {area}" line, mint price line. Web shows area, not distance.
- Poster rules: crop to fill from the centre, never stretch. No image → type-only fallback poster in the card colours with the event title [confirm with Ayush how many events lack images].
- Round mint Tandem button bottom right = "Send to a friend" on the web [confirm what it does in the app].
- Cards behind the top card peek out rotated, as in the app's Discover stack.
- Swipe hint under the deck in small grey text; words from the handoff ("Right if you're in. Left for not now. Down for never.").

**Swipe feedback:** use the app's own if it has any [confirm with Ekta]. Otherwise a small label while dragging: mint "I'm in" right, grey "Not now" left, "Never" down in fail red. No full-card colour wash.

**Web-only additions (app palette)**
- Progress bar to 35 in Green.
- Phone and code sheets on Surface 1 with the white pill as main button.
- Desktop layout and QR prompts.
- Icons and arrows on Green are near-black. Disabled buttons at 40% opacity. Inline errors in fail red.
- Collect, never redraw: Tandem logo SVG, favicon, official App Store and Google Play badges.

**Motion:** full spec in section 5. One showpiece only: the match screen.

**Don't**
- Don't invent a new style. Earlier ticket-stub mockups are for layout and flow only.
- Yellow is an accent, never a large button or background.
- No gradient washes, glassmorphism or neon glows beyond the design file's soft icon/nav glows.
- No dating-app language: hearts, flames, single profile photos on cards.
- No "Download the app" as the first thing anyone sees.

## 3. Screens to design
43 screens, many sharing one layout. Every row in the handoff's copy section maps to one. Design every row at 390 px and starred ones at 1440 px too. Copy from the handoff, word for word.

**Sample values:** {city} = Bengaluru, {event} = Indie Gig Night, {day} = Sat 23 Nov, {area} = Indiranagar, {sender} = Riya, {friend} = Arjun, {creator} = Sukalyan, {N} = 550+, {count} = 12, {phone} = 98••••43210, {price} = [PRICE], {tries_left} = 2, {their city} = Lucknow. Web is dark only.

### Journey 1: the swipe deck (/swipe)

| # | Screen | Layout | Headline | Body | Buttons |
| :- | :- | :- | :- | :- | :- |
| 1* | Deck, first card | Header (wordmark, city chip), deck heading, card stack, hint, 3 action buttons, progress 0/35. Desktop: centred column ~420 px, key hints under the buttons | Saw {creator}'s reel? Here's what's on in {city}. | Swipe right on what you'd do. Get the app to see which friends want the same. Hint: Right if you're in. Left for not now. Down for never. | Not now / Never / I'm in, share button on card |
| 2 | Deck heading variants | Same as 1, heading only | (a) What's on in {city} this week (b) You scanned it. Now swipe it. | (a) Same body as 1 (b) Plans in {city}. Swipe right on what you'd do. | Same |
| 3* | Mid-drag, three directions | Card dragged right with mint "I'm in" label at 70%; left "Not now"; down "Never" | | | |
| 4 | City picker | Sheet from the header city chip: live cities as chips, "Other city" leads to 19 | | | City chips |
| 5 | Toasts on the deck | Small toast above the buttons, auto-dismiss 3 s | | First Never: Got it. You'll see less like this. / After Not now on the phone step: No problem. Keep swiping. Your swipes stay on this phone for now. / Shared: Sent. When they say they're in, you'll see it in the app. / Rate limit: Hang on a sec. Too many requests. Try again in a minute. / Return, not capped: Welcome back. Pick up where you left off. / Swipe not saved: Couldn't save that swipe. Trying again. / Copy link: Link copied. | |
| 6 | Loading and feed error | Skeleton event card; error centred | Couldn't load plans | Finding what's on in {city}... / Check your connection and try again. | Retry |
| 7* | Phone ask | Bottom sheet over dimmed deck (centred modal on desktop), phone field with +91, consent line. States: empty (Send code disabled), invalid (Enter a 10-digit mobile number.), sending (spinner) | Save your picks | You're in for 3 plans. Add your number to save them. Your swipes come with you when you get the app. | Send code / Not now |
| 8 | Phone ask, picky | Same sheet | Picky. We like that. | Add your number to save your swipes and get better picks. | Send code / Not now |
| 9* | Code entry | Same sheet, 4 code boxes, resend timer, inline error, verifying state | Enter the code | We sent a 4-digit code to {phone}. Error: That code didn't work. {tries_left} tries left. (1 left: That code didn't work. 1 try left.) The 3rd wrong code opens 10. | Verify; Resend in 0:30, then Resend code |
| 10 | Phone blocked | Same sheet | Too many tries | Try again in 30 minutes, or get the app and sign in there. | Get the app; text link: Already have it? Open Tandem |
| 11 | Code not arriving | Same sheet | Code not arriving? | SMS can be slow. Get the app and sign in there instead. | Get the app / Keep waiting; text link: Already have it? Open Tandem |
| 12 | You're in | Toast-sized confirmation after replay | You're in | {count} swipes saved. Get the app to see which friends want the same. If {count} is 0: Swipe right on anything you'd do. | |
| 13* | Send to a friend | Sheet with mini card. Phones: share sheet; desktop: WhatsApp Web + Copy link (toast: Link copied.). Message: I'm in for {event} on {day}. You in? {link} | Know someone who'd go to {event}? | Send it to them. If they're in, it's a plan. | Send on WhatsApp / Not now |
| 14 | Soft prompts | Dismissible banner above the buttons, deck usable | | At 10: 10 swipes in. Get the app and allow contacts to see which friends want the same. At 25: 25 swipes in. Only the app can match you with friends. | Get the app / Later |
| 15* | Match | Full screen, two cards slide together, mint burst | {friend} is in too! | {event}, {day}. Plan it together in the app. | Get the app / Keep swiping; text link: Already have it? Open Tandem |
| 16* | Hard stop, verified | Full screen, fanned stack behind, big {N} | {N} more plans in {city} are waiting in the app. (N under 20: Keep going in the app) | You've used your 35 web swipes, and they're saved. Download Tandem and allow contacts to see which friends want the same. (Under 20: ...New plans land every day, and the app shows you first.) | Download now; text link: Already have it? Open Tandem |
| 17 | Hard stop, not verified | Same | Same headline rule | You've used your 35 web swipes. Download Tandem to keep going, or save these swipes with your number first. | Download now / Save my swipes first |
| 18 | End of deck | Empty stack outline, city chips | That's everything on in {city} right now | New plans land every day. In the app, you see them first, and which friends are in. | Get the app / Try another city |
| 19 | City not supported | City chips + one-field waitlist; toast: Done. You'll be the first to know. | We're not in {their city} yet | Pick a nearby city, or leave your number and we'll tell you when we launch there. | Tell me / city chips |
| 20* | Desktop app prompt | Modal with QR and official badges | Get Tandem on your phone | Scan with your phone camera. | QR, badges |
| 21 | Open in browser | Arrow to the in-app browser menu (iOS in-app browsers only) | Open this in your browser | Tap ... at the top, then "Open in browser". | |
| 22 | Return visit, capped | Full screen | Welcome back | Your swipes are saved. Get the app to keep going and see who's in. | Get the app; text link: Already have it? Open Tandem |
| 43* | Event details page (tap on a card) | Full page like the app's event page: back arrow + title header, poster, title, date and time · {area}, price, venue, description. Journey 2: "{sender} is in" row; cold visitors no friend rows. Swipe buttons fixed at the bottom. Desktop: centred, poster left, details right. Back returns to the same card; an action shows the next | {event} | {day}, time · {area} · {price}, then the event description | Not now / Never / I'm in, share button |

### Journey 2: friend's link (/l/links, /e/, /r)

| # | Screen | Layout | Headline | Body | Buttons |
| :- | :- | :- | :- | :- | :- |
| 23* | Invite | One large card, violet strip with {sender}'s avatar and "is in", no deck | {sender} is in for this | {event} · {day} · {area} | I'm in / Not now |
| 24 | Phone ask, invite | Sheet | Tell {sender} you're in | Add your number to say yes. {sender} sees it in Tandem. | Send code / Not now |
| 25* | Accepted | Card with mint "You're in" chip | You're in for {event} | {sender} will see it in Tandem. Get the app to plan it together, and allow contacts to find more friends. | Get the app / Keep swiping in {city}; text links: Already have it? Open Tandem, and Send it to someone else |
| 26 | Already accepted | Same as 25 | You're already in | {sender} can see it in Tandem. Plan the rest in the app. | Get the app; text link: Already have it? Open Tandem |
| 27 | Not now (invite) | Short header above the city deck | No worries | Here's what else is on in {city}. | Opens the city deck |
| 28 | Own link | Card plus share actions | This is your invite | Send it to someone you'd go with. | Send on WhatsApp / Copy link |
| 29 | Event only | Like 23 without the strip, price shown | {event} | {day} · {area} · {price} | I'm in / Not now |
| 30 | Phone ask, event | Sheet | Save this plan | Add your number to save it. Get the app to see which friends want to go. | Send code / Not now |
| 31 | Event saved | Card with mint "Saved" chip | Saved: {event} | Get the app and allow contacts to see which friends want to go. | Get the app / See more in {city} |
| 32 | Event, swipes used up | Card plus app ask | You've used your 35 web swipes | Save {event} in the app, and see which friends want to go. | Get the app; text link: Already have it? Open Tandem |
| 33 | Referral only | Violet strip with {sender}'s avatar above the city deck | {sender} invited you to Tandem | Swipe on what's on in {city}. Get the app to match with {sender} and your other friends. | Opens the city deck |
| 34 | Event over | Greyed-out card above the city deck | This one's over | Here's what's on in {city} this weekend. | Opens the city deck |
| 35 | Broken link | Same as 34 without the card | This link doesn't work anymore | Here's what's on in {city} instead. | Opens the city deck |

The push to the sender is an app notification, not a web screen.

### Journey 3: crawlable pages

| # | Screen | Layout | Content |
| :- | :- | :- | :- |
| 36* | Homepage | Header (wordmark, city chip, FAQ link). Hero: heading left, live deck right on desktop; stacked on phone. Then How it works (3 steps), group chat, free, cities, badges, footer | Heading: Swipe on things to do. Match with friends who want the same. Sub: No more "let's plan something" that never happens. Swipe on what you'd actually do, and the app matches you with friends who want the same. Steps: Swipe on plans / Your friends swipe too / Match and go |
| 37* | City page | Intro, deck preset to the city, how it works, badges, footer | Things to do in {city} with friends. Intro from the handoff |
| 38* | FAQ | Single column of H2 questions, answers open, no accordions | Questions from the handoff |
| 39 | 404 | Single greyed-out card | This page took a wrong turn. Here's what's on in {city} instead. See plans |
| 40* | /download on desktop | QR plus official badges | Get Tandem on your phone. Scan with your phone camera to download. |
| 41 | Link preview images (1200×630) | Invite and event links use the event's real landscape image as is (og:image, no text added). Homepage, city and referral links use one designed default PNG with the headline set in | Invite: {sender} wants to go to {event}. Default: Tandem: swipe on plans, match with friends |
| 42 | Footer (shared) | Store badges, FAQ, Privacy Policy, Terms, contact | Links only |

/download on mobile redirects straight to the store; no design needed.

## 4. Interaction rules the design must show

| Rule | What the design must show |
| :- | :- |
| Right = I'm in, left = not now, down = never | Three buttons under the deck, plus drag feedback in all three directions |
| Up swipe | Not on the web. No up arrow or up gesture anywhere |
| Desktop swiping | Mouse drag, arrow keys (← → ↓) and buttons. Key hints under the buttons on desktop only |
| 35-swipe limit | Visible progress bar or "x/35" counter from the first swipe |
| Phone ask at the 3rd right or 8th swipe | Bottom sheet over the deck, never a new page. "Not now" as easy to tap as "Send code" |
| App asks | Never first on any page. "Open Tandem" only on hard stop, match, return visit after hard stop, code-trouble screens (plus Accepted, Already accepted, Event swipes used up in Journey 2) |
| Soft prompts at 10 and 25 | Banner that doesn't block the deck |
| One screen at a time | Match, then You're in, then send-to-friend, then soft prompts. Never stack two |
| Thumb reach | Every primary button in the bottom third on phones, 48 px tall minimum |
| First paint | First card visible in under 3 s on mid-range Android over 4G; heading and card render before fonts or images finish |
| Accessibility | Visible focus rings, labelled buttons, 4.5:1 contrast, reduced motion respected |
| Down swipe on scrolling pages | Card captures the drag only when it starts on the card (touch-action: none on the card); elsewhere the page scrolls. The Never button always works |
| Instagram and Facebook in-app browsers | Use 100dvh and safe-area padding so buttons and sheets never sit under the bars. Design screens 1, 7 and 16 at 390×700 too |
| Sheets and modals | Focus moves in and stays; Escape and backdrop tap close like Not now; keyboard never covers Send code |

## 5. Transitions and motion
Each screen change has one motion, one duration and one reduced-motion fallback. Anything not listed changes instantly. Only showpiece: the match screen.

**Motion tokens**

| Token | Value | Use |
| :- | :- | :- |
| Fast | 150 ms | Toasts out, button press, progress bar, chips |
| Base | 200 ms | Sheets close, toasts in, fades, spring back |
| Slow | 250 ms | Sheets open, card fly-off, deck slide |
| Showpiece | 600 ms | Match screen only |
| Ease out (entering) | cubic-bezier(0.2, 0.8, 0.2, 1) | Appearing or settling |
| Ease in (leaving) | cubic-bezier(0.4, 0, 1, 1) | Leaving the screen |
| Swipe threshold | 100 px drag, or release faster than 0.5 px/ms | Fly-off vs spring back |

**Swiping**

| From | Trigger | To | Motion | Reduced motion |
| :- | :- | :- | :- | :- |
| Skeleton (6) | Feed loads | First card (1) | Card fades in, Base. No stagger, no slide | Same |
| Card at rest | Drag starts on the card | Mid-drag (3) | Follows pointer 1:1, rotates dx/20 deg up to 12, label opacity rises with distance to threshold | Follows pointer, no rotation |
| Mid-drag | Released past threshold | Next card | Flies off in drag direction, Slow, ease in; next card scales 0.95→1 and rises 8 px, Base; progress bar grows, Fast | Fade out / fade in, Base |
| Mid-drag | Released short | Same card | Springs back, Base, ease out | Snaps back |
| Card at rest | Button tap or arrow key | Next card | Same fly-off on its own in that direction, label shown | Fade |
| Card at rest | Tap on the card | Event details (43) | Slides in from right, Slow, ease out. Back slides out right, Base, ease in, onto the same card. Action closes it the same way, then the card flies off | Fade |
| Last card | Swipe | End of deck (18) | Card flies off, empty outline fades in, Base | Fade |
| 35th swipe | Swipe | Hard stop (16, 17) | Card flies off, fanned stack rises 24 px and fades in, Slow; text and buttons fade in after. {N} appears as is, never counts up | Fade, Base |
| Any deck | City changed (4) | New deck | Cards fade out, skeleton, new first card fades in | Same |

**Sheets, modals and prompts**

| From | Trigger | To | Motion | Reduced motion |
| :- | :- | :- | :- | :- |
| Deck | 3rd right or 8th swipe | Phone ask (7, 8) | Backdrop to 60% black, Base; sheet slides up, Slow, ease out. Desktop: modal scales 0.96→1 and fades, Base. Focus to phone field | Fade, Base |
| Phone ask | Send code | Code entry (9) | Content slides left inside the same sheet, Base; height animates. Never closes/reopens | Cross-fade |
| Code entry | Wrong code | Error state | Boxes shake 3 times over 300 ms, turn fail red | Red, no shake |
| Code entry | 3rd wrong code or 2nd resend | 10 or 11 | Cross-fade inside the sheet, Base | Same |
| Code entry | Correct code | You're in (12) | Sheet slides down, Base, ease in; swipes replay; toast slides up | Fades |
| Any sheet | Not now, Escape, backdrop | Deck | Sheet slides down, Base, ease in; backdrop fades; focus back to deck | Fade |
| You're in | Toast ends | Send to a friend (13), first time only | Sheet opens as above | Fade |
| Deck | 10th or 25th swipe | Soft prompt (14) | Banner slides down 8 px and fades in, Base | Fade |
| Deck | Any toast (5) | Toast | Rises 8 px and fades in, Base; holds 3 s; fades out, Fast | Fade only |
| Deck | Match reported | Match (15) | Deck dims, Base. Two cards slide in from left and right and overlap, Showpiece, ease out; Green burst scales 0→1.2 and fades as they meet; headline and buttons fade in at 400 ms | Fade in together, Base, no burst |
| Any app prompt | On desktop | Desktop prompt (20) | Modal scales 0.96→1 and fades, Base | Fade |
| Hard stop not verified (17) | Save my swipes first | Phone ask (7), then 16 | Sheet over the hard stop; after verifying it closes and body cross-fades to the verified version, Base | Fades |
| Match (15) | Keep swiping | Deck | Fades out, Base; deck undims | Same |
| Soft prompt (14) | Later, or a swipe | Deck | Banner slides up 8 px and fades, Fast | Fade |
| Feed error (6) | Retry | Skeleton, first card | Error fades out, skeleton in, then as Swiping | Same |
| Page load | Return capped, or city not live | 22 or 19 | Fades in, Base. No deck first | Same |
| Store link in iOS in-app browser | Page still visible after 2.5 s | Open in browser (21) | Overlay fades in, Base; arrow nudges toward menu twice, Slow | Fade, no nudge |

When several screens are due at once, each finishes its exit before the next enters: match, You're in, send to a friend, soft prompt. Never two at once.

**Journey 2 and pages**

| From | Trigger | To | Motion | Reduced motion |
| :- | :- | :- | :- | :- |
| Link opened | Page load | Invite (23) or Event only (29) | Card fades in, Base. No skeleton flash if the snapshot holds the card | Same |
| Invite | I'm in | Phone ask, invite (24) | Sheet opens as in the deck | Fade |
| Phone ask, invite | Verified | Accepted (25) | Sheet closes; "You're in" chip pops, 0.8→1, Base, ease out; text cross-fades | Chip fades in |
| Invite | Not now | Not now (27) + city deck | Card fades out, Base; deck rises 16 px and fades in, Slow | Cross-fade |
| Accepted | Keep swiping in {city} | City deck | Same as above | Cross-fade |
| Any page | Route change | New page | Instant, scroll to top. No page transitions | Same |
| Share button | Tap | Share sheet or WhatsApp | Button scales to 0.92 and back, Fast | No scale |
| Event only (29) | I'm in, verified | 30, then 31 | Sheet as in the deck; "Saved" chip pops like Accepted | Fades |
| Invite (23) or Event only (29) | Tap on the card | Event details (43) | As in the deck | Fade |
| Link opened | Referral only, event over, broken link | 33, 34, 35 + city deck | Header and card fade in, Base; deck loads as Swiping | Same |

## 6. Prompts for screen design tools
Use in Claude Design, or Claude Code with the frontend-design skill. Paste sections 1 to 5 first, attach the design system image and app screenshots, then one prompt at a time.

**Prompt A: design system first (run once)**
Build a design token file and a component sheet for the Tandem web funnel that matches the attached Tandem design system and app screenshots exactly. Use the colour roles, type and card anatomy in section 2; the hex values come from the design system file, so use them exactly. Components: header (wordmark, city chip, FAQ link), city picker sheet, event card (with and without the violet strip, missing-image fallback, greyed-out state), avatar stack, card stack, skeleton card, event details page, three swipe buttons with desktop key hints, drag labels for right, left and down, progress bar to 35, bottom sheet (and its centred desktop modal), phone field with +91, code boxes with error line and resend timer, primary and secondary buttons, text link, banner, toast, status chips (You're in, Saved), city chips, QR prompt, official store badges, empty state, error state, how-it-works steps, FAQ item, footer. Show each at 390 px, and header, deck and modal at 1440 px too. Output React + Tailwind using CSS variables for every token.

**Prompt B: one screen at a time**
Using the component sheet we just made, design screen #[number] from section 3 at 390 px [and at 1440 px if starred]. Use the exact headline, body and button copy with the sample values filled in. Follow the interaction rules in section 4 and build the entry and exit motion exactly as section 5 specifies, including the reduced-motion version. Don't add copy, sections or features that aren't in the brief. Output React + Tailwind, one component per screen.

**Prompt C: the deck, working**
Build the swipe deck (screens 1 and 3) as a working prototype: drag with mouse and touch, arrow keys on desktop, the three buttons, drag labels for right, left and down, fly-off and spring-back using the motion tokens and swipe threshold in section 5, a progress counter that stops at 35. Fake 12 events in Bengaluru with poster images. Respect prefers-reduced-motion. No up swipe.

**Prompt D: homepage**
Design screen #36, the homepage, at 1440 px and 390 px. Desktop hero: heading and sub on the left, the live deck on the right. Then How does Tandem work (3 steps), Why not just use the group chat, Is Tandem free, Which cities, app badges, FAQ link. All text is real HTML, so search engines and AI crawlers can read it. Use the copy from section 3 and keep every [confirm] marker visible.

Critique pass after each screen: "Compare this against the design system image and app screenshots. List every place it drifts from their colours, radius, type, spacing or motion, then fix them."

## 7. Prompts for Higgsfield (imagery and motion)
On the live site every card uses the real poster from the feed. Never ship an AI poster for a real event.

| Asset | Size | Where it goes |
| :- | :- | :- |
| Placeholder posters for mockups and prototype | 3:4, 1200×1600 | Design comps only, replaced by feed images in the build |
| Homepage hero loop (optional) | 16:9 loop, 6 to 8 s, under 1.5 MB, desktop only | Behind or beside the desktop hero deck |
| OG link preview backgrounds | 1200×630 | Default and city previews (event previews use the real poster) |
| Reel stills and covers for Sukalyan | 1080×1920 | Instagram, outside the site |

**Placeholder posters:** Event poster for "[Indie Gig Night]" in Bengaluru, [Indiranagar], collage style like a modern gig poster: bold condensed headline type, cut-out photo elements, risograph texture, [violet and mint] accents on a dark background. Portrait 3:4. Include the event name and date "[Sat 23 Nov]". No real brand or venue logos. Make 12: gig, stand-up, sunrise ride to Nandi Hills, food walk, brewery quiz, pottery workshop, open mic, trek, jazz night, flea market, board game cafe, rooftop film screening. Vary style per poster.

**Hero loop:** Short looping background video: event poster cards drifting slowly in a loose fan on near-black with a faint dark-teal glow, violet and mint light accents. 7 s seamless loop, no text, no phone, no app interface, no faces. No fake app recordings. Loads only after the deck has rendered, desktop only.

**OG background:** 1200×630 near-black with a faint dark-teal glow top left, a loose fan of 5 poster cards tilted on the right third, empty left two thirds for a headline. Violet and mint only, no text. Set the headline on top in a design tool in Anek Latin Bold, export PNG, keep text inside the middle 1000×500.

## 8. Acceptance checklist
- [ ] Side by side with an app screenshot, it reads as the same product.
- [ ] Colours, type and form states match the design system file.
- [ ] Copy matches the handoff word for word, [PRICE] and [confirm] markers visible.
- [ ] No up swipe, no app download ask first on any page.
- [ ] Works at 360, 390 and 1440 px; desktop deck works with mouse and arrow keys.
- [ ] Primary buttons in the bottom third on phones, at least 48 px tall.
- [ ] Focus rings, screen reader labels on icon buttons, 4.5:1 contrast.
- [ ] Reduced motion turns fly-offs and the match burst into cross-fades.
- [ ] All page text is real HTML.
- [ ] No AI poster stands in for a real event on the live site.
- [ ] Output is React + Tailwind with tokens as CSS variables.
- [ ] Screens 1, 7 and 16 work inside Instagram's in-app browser on a real phone.
- [ ] On the homepage, a down drag on the card swipes Never; beside it, the page scrolls.
- [ ] Cards handle wide, tall and missing posters without stretching or blank space.
- [ ] Every section 5 transition built with its duration, easing and reduced-motion version; nothing else animates.
- [ ] Every row of the handoff's copy section has a designed screen or state.

**Open questions before design starts**
- [ ] Anek Latin width value (designer).
- [ ] Does the app show feedback while dragging a card? (Ekta)
- [x] Confirmed: the code is 4 digits.
- [ ] Age band of the target audience (Shreyas).
- [ ] What the round mint button on the app's card does today (Ekta).
- [ ] How many feed events have no poster image (Ayush).
- [x] Decided: tapping a card opens the event details page (43).
- [x] Done: copy for invalid number, Link copied and failed swipe save.
