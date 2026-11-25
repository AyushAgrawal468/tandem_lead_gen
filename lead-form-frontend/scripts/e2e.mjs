// Days 4-5 scripted journeys (tracker: "Playwright scripts for all 3 journeys").
// Runs every journey on iPhone, Android, Instagram in-app and Facebook in-app user agents.
// The feed and link APIs are faked with page.route, so results don't depend on the day's events,
// and the phone step is only opened and closed: no OTP is ever sent.
//
//   npm run e2e                                # against https://demo.tandem.it.com
//   BASE=http://localhost:5174 npm run e2e
//
// ponytail: plain node + assert on the already-installed playwright, no test runner; move to
// @playwright/test if this grows past one file.
import assert from "node:assert/strict";
import { chromium, devices } from "playwright";

const BASE = (process.env.BASE || "https://demo.tandem.it.com").replace(/\/$/, "");
const LIMIT = 35; // WEB_SWIPE_LIMIT in src/lib/funnel.js

const IG_IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0.0.36.106 (iPhone14,5; iOS 17_5; en_IN; en; scale=3.00; 1170x2532; 600034442)";
const FB_ANDROID = "Mozilla/5.0 (Linux; Android 14; SM-A546E Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/462.0.0.47.86;]";
// Playwright's iPhone profile targets WebKit; on Chromium keep its screen and UA, drop the browser type
const { defaultBrowserType: _t, ...IPHONE } = devices["iPhone 13"];
const ENVS = {
  "iPhone Safari": IPHONE,
  "Android Chrome": devices["Pixel 7"],
  "Instagram (iOS)": { ...IPHONE, userAgent: IG_IOS },
  "Facebook (Android)": { ...devices["Pixel 7"], userAgent: FB_ANDROID },
};

// ---------- fake API ----------

const event = (i) => ({ eventId: `e2e${String(i).padStart(4, "0")}`, title: `Test plan ${i}`, displayDate: "Sat 29 Nov", location: "Indiranagar", displayPrice: "₹499 onwards" });
const FEED = { events: Array.from({ length: 45 }, (_, i) => event(i + 1)), next_cursor: null, total_upcoming: 45 };
const SENDER = { firstName: "Riya", photo: "" };

async function fakeApi(page, link = { event: event(1), city: "Bengaluru", eventOver: false, sender: SENDER }) {
  const json = (body) => ({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: JSON.stringify(body) });
  await page.route("**/events/public/feed**", (r) => r.fulfill(json(FEED)));
  await page.route("**/events/public/link**", (r) => r.fulfill(json({ statusId: "1", ...link })));
  // Never let a test reach a real send or save
  await page.route(/\/(auth|events\/web|user)\//, (r) => r.fulfill({ status: 500, body: "blocked by e2e" }));
  await page.route(/\/api\/(referral|event-link|links)\//, (r) => r.fulfill({ status: 200, body: "{}" }));
}

const dialog = (page) => page.locator('[role="dialog"]');
const card = (page) => page.locator("[data-event-card]").first();

async function swipe(page, label) {
  await page.getByRole("button", { name: label, exact: true }).first().click();
  await page.waitForTimeout(320); // fly-off animation
}

async function closeSheetIfOpen(page) {
  const sheet = dialog(page);
  if (await sheet.count()) {
    await sheet.getByRole("button", { name: "Not now" }).click();
    await assert.doesNotReject(sheet.waitFor({ state: "detached", timeout: 3000 }), "Not now closes the phone step");
  }
}

// ---------- journeys ----------

// Journey 1: a reel link to /swipe. Cards on the first screen, no prompt before the first swipe,
// phone step at the 3rd right, Not now keeps swiping, soft prompt at 10, hard stop at 35.
async function journey1(page) {
  await fakeApi(page);
  await page.goto(`${BASE}/swipe?city=Bengaluru&utm_campaign=e2e`);
  await card(page).waitFor();
  const box = await card(page).boundingBox();
  assert.ok(box.y + box.height * 0.6 <= page.viewportSize().height, "most of the card is on the first screen");
  assert.equal(await dialog(page).count(), 0, "no prompt before the first swipe");

  // A real drag counts as a swipe (right)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 260, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  await page.getByText("1/35").waitFor();

  await swipe(page, "I'm in");
  await swipe(page, "I'm in"); // 3rd right
  await page.locator("#phone-title").waitFor({ timeout: 3000 });
  await closeSheetIfOpen(page);

  for (let n = 4; n <= 10; n++) await swipe(page, n % 2 ? "Not now" : "Never");
  await page.getByText("10 swipes in", { exact: false }).waitFor({ timeout: 3000 });
  await page.getByRole("button", { name: "Later" }).click();

  for (let n = 11; n <= LIMIT; n++) {
    await swipe(page, "Not now");
    if (n === 25) await page.getByRole("button", { name: "Later" }).click();
  }
  await page.getByRole("button", { name: "Get Tandem free" }).first().waitFor({ timeout: 3000 });
  await page.getByRole("button", { name: "Save my swipes first" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "I'm in", exact: true }).count(), 0, "no swipe buttons after the hard stop");
  await page.getByText(`${LIMIT}/${LIMIT}`).waitFor();
}

// Journey 2: shared links. Invite, event-only, broken and finished events; "I'm in" first.
async function journey2(page) {
  await fakeApi(page);
  await page.goto(`${BASE}/l/links?event-id=e2e0001&referral-code=RIYA1234`);
  await page.getByRole("heading", { name: "Riya is in for this" }).waitFor();
  // Handoff audit #6: the invite answers with the round buttons, Not now and I'm in, no Never
  assert.equal(await page.getByRole("button", { name: "Never", exact: true }).count(), 0, "no Never on an invite");
  assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count() > 0, "personal link is noindex");
  await page.getByRole("button", { name: "I'm in", exact: true }).click();
  await page.locator("#phone-title").waitFor({ timeout: 3000 }); // no session: the phone step
  await closeSheetIfOpen(page);

  await page.unrouteAll({ behavior: "ignoreErrors" });
  await fakeApi(page);
  await page.goto(`${BASE}/e/e2e0001`);
  await page.getByRole("heading", { level: 1, name: "Test plan 1" }).waitFor();
  await page.getByRole("button", { name: "Not now", exact: true }).click();
  await page.getByRole("heading", { name: "No worries" }).waitFor();

  await page.unrouteAll({ behavior: "ignoreErrors" });
  await fakeApi(page, { event: null, sender: null });
  await page.goto(`${BASE}/e/000000000000000000000000`);
  await page.getByRole("heading", { name: "This link doesn't work anymore" }).waitFor();

  await page.unrouteAll({ behavior: "ignoreErrors" });
  await fakeApi(page, { event: event(2), city: "Bengaluru", eventOver: true, sender: null });
  await page.goto(`${BASE}/e/e2e0002`);
  await page.getByRole("heading", { name: "This one's over" }).waitFor();
}

// Journey 3: search and AI crawlers land on the homepage; the deck and the FAQ work.
async function journey3(page) {
  await fakeApi(page);
  await page.goto(`${BASE}/`);
  await page.getByRole("heading", { level: 1, name: /Swipe on things to do/ }).waitFor();
  await card(page).waitFor();
  assert.equal(await page.locator('meta[name="robots"][content*="noindex"]').count(), 0, "homepage is indexable");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "no sideways scroll");
  await page.getByRole("link", { name: "FAQ" }).first().click();
  await page.getByRole("heading", { level: 1, name: "Tandem FAQ" }).waitFor();
  await page.goto(`${BASE}/bengaluru`);
  await page.getByRole("heading", { level: 1, name: /Things to do in Bengaluru/ }).waitFor();
  await card(page).waitFor();
}

// ---------- runner ----------

const JOURNEYS = { "Journey 1 (reel → /swipe)": journey1, "Journey 2 (shared links)": journey2, "Journey 3 (homepage, FAQ, city)": journey3 };
const browser = await chromium.launch();
let failed = 0;
console.log(`E2E against ${BASE}\n`);
for (const [envName, env] of Object.entries(ENVS)) {
  for (const [name, run] of Object.entries(JOURNEYS)) {
    const ctx = await browser.newContext(env);
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const t = Date.now();
    try {
      await run(page);
      assert.deepEqual(errors, [], "no uncaught page errors");
      console.log(`  ok    ${envName.padEnd(20)} ${name} (${((Date.now() - t) / 1000).toFixed(1)}s)`);
    } catch (e) {
      failed++;
      const shot = `e2e-fail-${envName}-${name}`.replace(/[^\w-]+/g, "_") + ".png";
      await page.screenshot({ path: shot }).catch(() => {});
      console.log(`  FAIL  ${envName.padEnd(20)} ${name}\n        ${e.message.split("\n")[0]}\n        screenshot: ${shot}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(failed ? `\n${failed} failed` : "\nAll journeys passed");
process.exit(failed ? 1 : 0);
