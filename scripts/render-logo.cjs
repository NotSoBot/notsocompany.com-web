// Cuts NotSoBot's sunglasses out of its logo into src/assets/logos/NotSoCompanyLogo.svg and renders public/favicon.ico
// and public/logo.png from it. Uses notsobot.com-web's sharp (like email-avatar/render-avatar.js), this repo doesn't need it.
//   node scripts/render-logo.cjs
// NotSoBot's logo is `.magik` on `.b1`, so the glasses are cut from the logo itself rather than redrawn or magik'd
// again: seam carving picks its seams from the whole image, glasses on their own would warp differently.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const sharp = require(path.join(ROOT, '../notsobot.com-web/node_modules/sharp'));

const DARK = '#2e2e2e', GRAY = '#848484', WHITE = '#fff';
// the logo's dark outline is about this thick (in its 480 units), shrinking the silhouette by it leaves the glasses'
// band ending where .b1's band met its ring
const RING = 12;
// how far the gray outline reaches past the glasses, roughly
const OUTLINE = 20;
// the glasses sit between these heights on the logo, below them is the mouth
const TOP = 190, BOTTOM = 328;
// around the glasses and their outline, in the logo's coordinates (so they stay where they are on NotSoBot)
const VIEWBOX = '-12 188 504 164';


const logo = fs.readFileSync(path.join(ROOT, 'src/assets/logos/NotSoLogo.svg'), 'utf8');
const paths = [...logo.matchAll(/<path class="(cls-\d)" d="([^"]+)"/g)].map(([ , cls, d ]) => ({cls, d}));
// the first path is the whole dark silhouette, the glasses are the part of it the gray head and face don't cover
const silhouette = paths[0].d;
const gray = paths.filter((p) => p.cls === 'cls-3').map((p) => p.d);
const glints = paths.filter((p) => p.cls === 'cls-2').map((p) => p.d);

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}"><title>NotSoCompany</title><defs>`,
  `<mask id="glasses" maskUnits="userSpaceOnUse" x="0" y="0" width="480" height="480">`,
  `<rect x="0" y="${TOP}" width="480" height="${BOTTOM - TOP}" fill="#fff"/>`,
  // edged a little so no antialiased hairlines are left where the gray meets the outline
  ...gray.map((d) => `<path d="${d}" fill="#000" stroke="#000" stroke-width="1.5"/>`),
  `<path d="${silhouette}" fill="none" stroke="#000" stroke-width="${RING * 2}"/>`,
  '</mask>',
  // the gray outline: the glasses' shape blurred, then everything past a low opacity filled in (a rounded dilate).
  // eroded a bit first so stray specks don't grow outlines of their own, the steep slope keeps the edge crisp
  `<filter id="outline" filterUnits="userSpaceOnUse" x="-30" y="${TOP - 30}" width="540" height="${BOTTOM - TOP + 60}" color-interpolation-filters="sRGB">`,
  '<feMorphology in="SourceAlpha" operator="erode" radius="1.5"/>',
  `<feGaussianBlur stdDeviation="${OUTLINE / 2}"/>`,
  '<feComponentTransfer><feFuncA type="linear" slope="120" intercept="-2.4"/></feComponentTransfer>',
  `<feComposite in="SourceGraphic" operator="over" result="shape"/>`,
  `<feFlood flood-color="${GRAY}"/><feComposite in2="shape" operator="in"/>`,
  '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>',
  '</filter></defs>',
  `<g filter="url(#outline)">`,
  `<path d="${silhouette}" fill="${DARK}" mask="url(#glasses)"/>`,
  ...glints.map((d) => `<path d="${d}" fill="${WHITE}"/>`),
  '</g></svg>\n',
].join('');


(async () => {
  fs.writeFileSync(path.join(ROOT, 'src/assets/logos/NotSoCompanyLogo.svg'), svg);

  const transparent = {r: 0, g: 0, b: 0, alpha: 0};
  const square = (size) => sharp(Buffer.from(svg), {density: 300}).resize(size, size, {fit: 'contain', background: transparent}).png().toBuffer();

  // favicon.ico: an ico holding 16/32/48px pngs (header, one directory entry per image, then the png data)
  const sizes = [16, 32, 48];
  const images = await Promise.all(sizes.map(square));
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[i].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
  });
  fs.writeFileSync(path.join(ROOT, 'public/favicon.ico'), Buffer.concat([header, ...images]));

  // the embed image for discord/twitter, on the page's `deep` background
  await sharp(Buffer.from(svg), {density: 300})
    .resize(400, 400, {fit: 'contain', background: '#202225'})
    .extend({top: 56, bottom: 56, left: 56, right: 56, background: '#202225'})
    .flatten({background: '#202225'})
    .png()
    .toFile(path.join(ROOT, 'public/logo.png'));

  console.log('wrote NotSoCompanyLogo.svg, favicon.ico, logo.png');
})();
