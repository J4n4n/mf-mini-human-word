// "Your Human in One Word" — reports the length of a single-word entry.
// Reads entry.txt from the bot directory, copies it to the output
// directory, and validates it against the 30-character limit.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 30;

function resolveDirs() {
  const inputDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return { inputDir, outputDir };
}

function stageEntry(inputDir: string, outputDir: string): string {
  const srcPath = join(inputDir, "entry.txt");
  const dstPath = join(outputDir, "entry.txt");
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(srcPath, dstPath);
  return dstPath;
}

// A trailing newline at the end of the file is just file formatting,
// not part of the word itself, so peel off that one newline
// before measuring the word's length.
function normalize(raw: string): string {
  return raw.endsWith("\n") ? raw.slice(0, -1) : raw;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function checkWord(word: string): void {
  if (word.length > MAX_CHARS) {
    fail(`Error: entry is ${word.length} characters, over the ${MAX_CHARS} character limit.`);
  }
  if (word.length === 0) {
    fail("Error: entry.txt is empty.");
  }
}

function main(): void {
  const { inputDir, outputDir } = resolveDirs();
  const stagedPath = stageEntry(inputDir, outputDir);
  const word = normalize(readFileSync(stagedPath, "utf8"));

  checkWord(word);

  console.log(`Character count: ${word.length}`);
  console.log(word);
}

main();
