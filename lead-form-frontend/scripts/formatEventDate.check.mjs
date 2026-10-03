// Run: node scripts/formatEventDate.check.mjs
import assert from "node:assert/strict";
import { formatEventDate as f } from "../src/lib/formatEventDate.js";

assert.equal(f("17/02/2026", "7:00 PM"), "17th Feb 26, 7 PM");
assert.equal(f("01/03/2026", "5:30 PM to 11:00 PM"), "1st Mar 26, 5:30 PM");
assert.equal(f("22/10/2026", "TBD"), "22nd Oct 26");
assert.equal(f("11/12/2026", ""), "11th Dec 26");
assert.equal(f("28/03/2026 to 29/03/2026", "5:00 PM"), "28th Mar 26 – 29th Mar 26, 5 PM");
assert.equal(f("2026-10-03", "9:00 am"), "3rd Oct 26, 9 AM");
assert.equal(f("Sat, 18 Oct, 6:00 PM", "18:00"), "Sat, 18 Oct, 6:00 PM"); // created events: pre-formatted
assert.equal(f("Sat, 18 Oct", "6:00 PM"), "Sat, 18 Oct, 6 PM");
assert.equal(f("TBD", "TBD"), "");
console.log("formatEventDate OK");
