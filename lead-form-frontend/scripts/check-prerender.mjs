// Days 4-5: "curl every prerendered route" (tracker). Reads each page the way a crawler does (raw
// HTML, no JS) and checks the real copy, head tags, nothing at opacity 0, no live cards, and that a
// personal link (/e/x) gets the empty shell, not the homepage.
//
//   npm run check:prerender                         # the local build in dist/ (after npm run build:site)
//   npm run check:prerender -- https://tandem.it.com
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const TARGET = (process.argv[2] || "dist").replace(/\/$/, "");
const SITE = "https://tandem.it.com"; // canonical host on every page, even when served from demo
const SHELL_TITLE = "Tandem - Social Planning App"; // index.html's own title: a page still showing it wasn't prerendered

// route → copy that must be in the raw HTML (the H1), and whether the page carries JSON-LD
const PAGES = {
  "/": { h1: "Swipe on things to do", jsonLd: true },
  "/swipe": { h1: "What's on in", jsonLd: false },
  "/faq": { h1: "Tandem FAQ", jsonLd: true },
  "/bengaluru": { h1: "Things to do in Bengaluru", jsonLd: true },
  "/mumbai": { h1: "Things to do in Mumbai", jsonLd: true },
};

async function load(route) {
  if (/^https?:/.test(TARGET)) {
    const res = await fetch(TARGET + route, { headers: { "user-agent": "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" } });
    assert.equal(res.status, 200, `HTTP ${res.status}`);
    return res.text();
  }
  const file = route === "/" ? "index.html" : route === "/e/x" ? "spa.html" : `${route.slice(1)}/index.html`;
  return readFile(`${TARGET}/${file}`, "utf8");
}

const attr = (html, re) => html.match(re)?.[1]?.trim() || "";
const text = (s) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");

function checkPage(route, html, { h1, jsonLd }) {
  const title = attr(html, /<title[^>]*>([^<]*)<\/title>/i);
  assert.ok(title && !title.startsWith(SHELL_TITLE), `not prerendered (title "${title}")`);
  assert.ok(attr(html, /<meta\s+name="description"\s+content="([^"]*)"/i), "meta description missing");
  assert.equal(attr(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i), SITE + (route === "/" ? "/" : route), "canonical");
  assert.ok(attr(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i), "og:title missing");
  assert.ok(attr(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i), "og:description missing");
  assert.ok(!/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html), "page is noindex");

  const body = html.slice(html.search(/<body/i));
  const h1Text = text(attr(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  assert.ok(h1Text.includes(h1), `H1 is "${h1Text}", expected "${h1}…"`);
  const words = text(body).split(" ").filter(Boolean).length;
  assert.ok(words >= 40, `only ${words} words of text in the body`);
  assert.ok(!/style="[^"]*opacity:\s*0(?![.\d])/i.test(body), "an element is at opacity 0");
  assert.ok(!body.includes("data-event-card"), "live event cards in the snapshot (rule 3)");
  if (jsonLd) assert.ok(/<script[^>]+application\/ld\+json/i.test(html), "JSON-LD missing");
  return `${words} words, "${title}"`;
}

let failed = 0;
console.log(`Prerender check: ${TARGET}\n`);
for (const [route, want] of Object.entries(PAGES)) {
  try {
    console.log(`  ok    ${route.padEnd(11)} ${checkPage(route, await load(route), want)}`);
  } catch (e) { failed++; console.log(`  FAIL  ${route.padEnd(11)} ${e.message.split("\n")[0]}`); }
}
// A personal link must get the untouched shell (spa.html), never the homepage snapshot
try {
  const html = await load("/e/x");
  assert.ok(html.includes('id="root"'), "no #root in the shell");
  assert.ok(!text(html).includes(PAGES["/"].h1), "serves the homepage snapshot instead of the shell");
  console.log("  ok    /e/x        empty app shell, not the homepage");
} catch (e) { failed++; console.log(`  FAIL  /e/x        ${e.message.split("\n")[0]}`); }

console.log(failed ? `\n${failed} failed` : "\nAll prerender checks passed");
process.exit(failed ? 1 : 0);
