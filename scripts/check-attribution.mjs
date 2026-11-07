#!/usr/bin/env node
// Fails if commits carry AI-tool attribution (author/committer identity or trailers).
//   node scripts/check-attribution.mjs                 audit the whole history
//   node scripts/check-attribution.mjs origin/main..HEAD   check a range (any `git rev-list` args)
import { execFileSync } from 'node:child_process';

const AI = /claude|anthropic|copilot|chatgpt|openai|gemini|cursoragent|codeium|windsurf|devin-ai|swe-agent/i;
const TRAILER = /^\s*(co-authored-by|assisted-by|generated-by|reviewed-by|signed-off-by)\s*:/i;
const SESSION = /^\s*claude-session\s*:/i;
const FOOTER = /^\W*(generated|created|written|assisted)\s+(with|by)\W*(claude|copilot|chatgpt|gemini)/i;

const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const args = process.argv.slice(2);

let shas;
try {
  shas = git('rev-list', ...(args.length ? args : ['HEAD'])).split('\n').filter(Boolean);
} catch (e) {
  console.error('check-attribution: could not list commits for:', args.join(' ') || 'HEAD');
  process.exit(2);
}

const problems = [];
for (const sha of shas) {
  const [author, committer, subject, body] = git(
    'show', '-s', '--format=%an <%ae>%x1f%cn <%ce>%x1f%s%x1f%B', sha
  ).replace(/\n$/, '').split('\x1f');

  const why = [];
  if (AI.test(author)) why.push(`author: ${author}`);
  if (AI.test(committer)) why.push(`committer: ${committer}`);
  body.split('\n').slice(1).forEach((line) => {
    if ((TRAILER.test(line) && AI.test(line)) || SESSION.test(line) || FOOTER.test(line)) why.push(`message: ${line.trim()}`);
  });
  if (why.length) problems.push({ sha: sha.slice(0, 7), subject, why });
}

if (problems.length) {
  console.error(`\n✖ AI attribution found in ${problems.length} of ${shas.length} commit(s):\n`);
  for (const p of problems) {
    console.error(`  ${p.sha}  ${p.subject}`);
    p.why.forEach((w) => console.error(`           ${w}`));
  }
  console.error('\nFix the latest commit with: git commit --amend   (then remove the line)');
  console.error('Older commits need a history rewrite.\n');
  process.exit(1);
}
console.log(`✔ No AI attribution in ${shas.length} commit(s) checked.`);
