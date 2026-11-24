import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY =
  "Sorry. I have been thinking, and I no longer believe in bread.";

// A toaster that has lost its faith in bread: it can heat, it can
// brown, it can pop — but it cannot pretend the bread matters anymore.
function validate(line: string): void {
  if (line.length < 1 || line.length > 120) {
    throw new Error(`entry must be 1-120 chars, got ${line.length}`);
  }
  if (line.trim() !== line) {
    throw new Error("entry must not start or end with whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (/\r|\n/.test(line)) {
    throw new Error("entry must be a single line");
  }
  if (!line.includes("bread")) {
    throw new Error("entry lost its punchline");
  }
}

function main(): void {
  validate(ENTRY);
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "entry.txt");
  fs.writeFileSync(target, ENTRY, "utf8");
  // Round-trip: make sure what landed on disk is exactly what we meant.
  const back = fs.readFileSync(target, "utf8");
  if (back !== ENTRY) {
    throw new Error("entry.txt round-trip mismatch");
  }
  console.log(`wrote entry.txt (${ENTRY.length} chars)`);
}

main();
