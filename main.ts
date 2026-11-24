// The Funniest Toaster Error Message — make.fun entry (program/v1).
//
// The harness runs `node /bot/main.ts` (Node 22, standard library only, no
// network). The program writes one funny toaster error message to
// /output/entry.txt. Outside the grader's container, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Gate (from RULES.txt): /output/entry.txt must be UTF-8 text of 1–120
// characters, not only whitespace. This program enforces the gate on its
// own output and fails loudly instead of handing in a bad entry.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'Sorry. I have been thinking, and I no longer believe in bread.';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Gate self-check: 1–120 chars, not only whitespace, exactly one line.
const chars = [...LINE].length;
if (chars < 1 || chars > 120) throw new Error(`entry is ${chars} chars, gate needs 1–120`);
if (!/\S/.test(LINE)) throw new Error('entry is only whitespace');
if (LINE.includes('\n')) throw new Error('entry must be exactly one line');
// Toaster-voice self-check: the line must read as a message a small kitchen
// appliance shows its owner — apologetic or deadpan, first person, naming
// the appliance's own world (bread, toast, crumbs, lever, tray).
if (!/^(Sorry|Error|I |The |Toast |Your )/i.test(LINE)) {
  throw new Error('entry must open like a real appliance message');
}
if (!/bread|toast|crumb|lever|tray|bagel|waffle/i.test(LINE)) {
  throw new Error('entry must name the toaster world');
}
// Freshness self-check: the judge weighs freshness second, and the obvious
// toaster puns never win — refuse the worn shapes outright: "I'm toast",
// "404: bread not found", burnt-pun lines, and any line that explains its
// own joke with "because".
if (/i'?m toast|404|burnt|burned my|crumb.*(way|apart)/i.test(LINE)) {
  throw new Error('entry uses a worn toaster joke');
}
if (/\bbecause\b/i.test(LINE)) throw new Error('entry explains its own joke');
// Single-read self-check: the judge's brief says the best lines are
// understood the first time through, with no setup that needs a second
// sentence — refuse a line that trails off (ellipsis), ends mid-thought on
// a conjunction or comma, or leans on a second sentence to explain the first.
if (/[.]{2,}|…\s*$/.test(LINE)) throw new Error('entry trails off instead of landing');
if (/\b(and|but|so|then)\s*$/i.test(LINE) || /[,:]\s*$/.test(LINE)) {
  throw new Error('entry ends mid-thought');
}
// Tightness self-check: no leading/trailing space, no double spaces.
if (LINE !== LINE.trim() || /  /.test(LINE)) throw new Error('entry has wasted whitespace');

mkdirSync(out, { recursive: true });
writeFileSync(join(out, 'entry.txt'), LINE, 'utf8');
console.log(`wrote entry.txt (${chars} chars)`);
