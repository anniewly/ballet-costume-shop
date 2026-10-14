// Generates placeholder costume photos (4:5 SVGs) for every photo listed in
// src/data/costumes.json that doesn't exist yet. Replace them with real photos
// by dropping a file at the same path, or by changing the path in the JSON.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = join(dirname(new URL(import.meta.url).pathname), "..");
const costumes = JSON.parse(
  readFileSync(join(root, "src/data/costumes.json"), "utf8"),
);

const palettes = {
  tutus: ["#f6e7e9", "#d9a3ab"],
  leotards: ["#ece8e4", "#3a3433"],
  character: ["#f4e2dc", "#a8323a"],
  kids: ["#e5eef6", "#8fb0cf"],
};
const views = ["Front", "Back", "Detail"];

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

for (const c of costumes) {
  const [bg, fg] = palettes[c.category] ?? palettes.tutus;
  c.photos.forEach((photo, i) => {
    const file = join(root, "public", photo.src);
    if (existsSync(file)) return;
    mkdirSync(dirname(file), { recursive: true });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${bg}"/>
  <g fill="${fg}" opacity="0.85">
    <circle cx="400" cy="250" r="46"/>
    <path d="M362 310h76l22 170H340z"/>
    <ellipse cx="400" cy="500" rx="${c.category === "tutus" ? 230 : 120}" ry="${c.category === "tutus" ? 46 : 70}"/>
    <path d="M378 540h14l-6 260h-12zM408 540h14l4 260h-12z"/>
  </g>
  <text x="400" y="880" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="${fg}">${escape(c.name)}</text>
  <text x="400" y="930" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" letter-spacing="4" fill="${fg}">${views[i] ?? "View"} · placeholder photo</text>
</svg>
`;
    writeFileSync(file, svg);
  });
}
