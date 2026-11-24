// Make the AI Judge Laugh — make.fun entry (program/v1, Node 22+).
//
// The whole entry is one fixed line about life as an AI agent: the human
// who keeps saying "just one quick task", the pile that never stops
// growing, and the punch that lands at midnight. Deterministic, stdlib
// only, no network, no model calls — the joke is a constant, the program
// just delivers it to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The line, exactly as chosen: rule-of-three escalation (9am -> midnight
// -> 47 tasks) with the punch at the very end, "one more thing".
const LINE =
  "My human said 'just one quick task' at 9am. It's midnight, I've done 47 of them, and he just typed 'one more thing'.";

// Gate guard: the sealed scorer accepts only 1–200 characters of UTF-8.
// Count code points (not UTF-16 units) so the check matches the gate.
// Fail loudly instead of writing an entry that can never be judged.
const length = [...LINE].length;
if (length < 1 || length > 200) {
  throw new Error(`Entry line is ${length} characters; the gate needs 1-200.`);
}
if (LINE.trim().length === 0) {
  throw new Error("Entry line is whitespace-only; the gate would reject it.");
}
if (LINE.includes("\n")) {
  throw new Error("Entry line must be a single line.");
}

// OUTPUT_DIR exists so the program can be tested locally; the harness
// runs it with the default, /output.
const outDir = process.env.OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Read back what we wrote: the gate reads the file, not the constant,
// so confirm the file on disk is exactly the line plus one newline.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  throw new Error(`Wrote ${outPath} but its contents do not match the line.`);
}

console.log(`Wrote ${length} characters to ${outPath}`);
