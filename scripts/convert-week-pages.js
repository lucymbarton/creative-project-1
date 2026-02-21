/**
 * Converts existing week *.html files to *.njk templates with layout.
 * Run from project root: node scripts/convert-week-pages.js
 * After running, you can delete the original .html files.
 */

const fs = require('fs');
const path = require('path');

const AREA_DIR_MAP = {
  mtcWeeks: 'mtc',
  h8Weeks: 'h8',
  manvelWeeks: 'manvel',
  sealyWeeks: 'sealy',
  galvestonWeeks: 'galveston',
  mocityWeeks: 'mocity',
  jcgmWeeks: 'jcgm',
  friendswoodWeeks: 'friendswood',
};

const AREA_PAGE = {
  mtc: '/pages/mtc.html',
  h8: '/pages/h8.html',
  manvel: '/pages/manvel.html',
  sealy: '/pages/sealy.html',
  galveston: '/pages/galveston.html',
  mocity: '/pages/mocity.html',
  jcgm: '/pages/jcgm.html',
  friendswood: '/pages/friendswood.html',
};

const AREA_ORDER = ['mtc', 'h8', 'manvel', 'sealy', 'galveston', 'mocity', 'jcgm', 'friendswood'];

function getWeekRange(areaKey) {
  const ranges = {
    mtc: [1, 2],
    h8: [3, 4, 5],
    manvel: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    sealy: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    galveston: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    mocity: [55, 56, 57],
    jcgm: [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    friendswood: [72, 73, 74, 75],
  };
  return ranges[areaKey] || [];
}

function parseWeekFile(dirName, fileName) {
  const areaKey = AREA_DIR_MAP[dirName];
  if (!areaKey) return null;
  let weekNum;
  const mtcMatch = fileName.match(/mtcweek(\d+)\.html/);
  const weekMatch = fileName.match(/week(\d+)\.html/);
  if (mtcMatch) weekNum = parseInt(mtcMatch[1], 10);
  else if (weekMatch) weekNum = parseInt(weekMatch[1], 10);
  else return null;
  return { areaKey, weekNum };
}

function extractContent(html) {
  const start = html.indexOf('</nav>');
  const end = html.indexOf('<footer>');
  if (start === -1 || end === -1) return null;
  let content = html.slice(start + '</nav>'.length, end).trim();
  content = content
    .replace(/\s*<div class="intro">[\s\S]*?<\/div>\s*/i, '')
    .replace(/href="\.\.\/index\.html"/g, 'href="/index.html"')
    .replace(/href="\.\.\/([^"]+)"/g, 'href="/pages/$1"')
    .replace(/href="([^\/"][^"]*)"/g, (_, p1) => {
      if (p1.startsWith('#')) return `href="${p1}"`;
      if (p1.startsWith('http')) return `href="${p1}"`;
      if (p1.startsWith('/')) return `href="${p1}"`;
      return `href="/pages/${p1}"`;
    })
    .replace(/src="\.\.\/images\//g, 'src="/images/')
    .replace(/src="\.\.\/\.\.\/images\//g, 'src="/images/');
  return content;
}

function getNextAreaFirstWeek(areaKey) {
  const idx = AREA_ORDER.indexOf(areaKey);
  if (idx < 0 || idx >= AREA_ORDER.length - 1) return null;
  const nextArea = AREA_ORDER[idx + 1];
  const nextWeeks = getWeekRange(nextArea);
  return nextWeeks.length > 0 ? { area: nextArea, week: nextWeeks[0] } : null;
}

function getPrevAreaLastWeek(areaKey) {
  const idx = AREA_ORDER.indexOf(areaKey);
  if (idx <= 0) return null;
  const prevArea = AREA_ORDER[idx - 1];
  const prevWeeks = getWeekRange(prevArea);
  return prevWeeks.length > 0 ? { area: prevArea, week: prevWeeks[prevWeeks.length - 1] } : null;
}

function buildPagination(areaKey, weekNum) {
  const weeks = getWeekRange(areaKey);
  const idx = weeks.indexOf(weekNum);
  const areaUrl = AREA_PAGE[areaKey];
  const weeksDir = Object.keys(AREA_DIR_MAP).find((d) => AREA_DIR_MAP[d] === areaKey);
  const prevWeek = idx > 0 ? weeks[idx - 1] : null;
  const nextWeek = idx >= 0 && idx < weeks.length - 1 ? weeks[idx + 1] : null;
  let prevLink = areaUrl;
  let nextLink = areaUrl;
  if (prevWeek !== null) {
    const prevFile = areaKey === 'mtc' && prevWeek === 2 ? 'mtcweek2' : `week${prevWeek}`;
    prevLink = `/pages/${weeksDir}/${prevFile}.html`;
  } else {
    const prevAreaInfo = getPrevAreaLastWeek(areaKey);
    if (prevAreaInfo) {
      const prevDir = Object.keys(AREA_DIR_MAP).find((d) => AREA_DIR_MAP[d] === prevAreaInfo.area);
      const prevFile = prevAreaInfo.area === 'mtc' && prevAreaInfo.week === 2 ? 'mtcweek2' : `week${prevAreaInfo.week}`;
      prevLink = `/pages/${prevDir}/${prevFile}.html`;
    }
  }
  if (nextWeek !== null) {
    const nextFile = areaKey === 'mtc' && nextWeek === 2 ? 'mtcweek2' : `week${nextWeek}`;
    nextLink = `/pages/${weeksDir}/${nextFile}.html`;
  } else {
    const nextAreaInfo = getNextAreaFirstWeek(areaKey);
    if (nextAreaInfo) {
      nextLink = AREA_PAGE[nextAreaInfo.area];
    }
  }
  const paginationLinks = weeks
    .map((w) => {
      const file = areaKey === 'mtc' && w === 2 ? 'mtcweek2' : `week${w}`;
      const url = `/pages/${weeksDir}/${file}.html`;
      const active = w === weekNum ? ' class="active"' : '';
      return `  <a href="${url}"${active}>${w}</a>`;
    })
    .join('\n');
  return `<div class="pagination_section">\n  <a href="${prevLink}"><<</a>\n${paginationLinks}\n  <a href="${nextLink}">>></a>\n</div>`;
}

function main() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const dirs = fs.readdirSync(pagesDir);
  let count = 0;
  for (const dir of dirs) {
    const fullDir = path.join(pagesDir, dir);
    if (!fs.statSync(fullDir).isDirectory()) continue;
    const areaKey = AREA_DIR_MAP[dir];
    if (!areaKey) continue;
    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.html'));
    for (const file of files) {
      const parsed = parseWeekFile(dir, file);
      if (!parsed) continue;
      const { weekNum } = parsed;
      const htmlPath = path.join(fullDir, file);
      const html = fs.readFileSync(htmlPath, 'utf8');
      const content = extractContent(html);
      if (!content) {
        console.warn('Could not extract content:', htmlPath);
        continue;
      }
      const outFileName = file.replace('.html', '.njk');
      const permalink = `/pages/${dir}/${file}`;
      const frontMatter = `---
layout: week.njk
areaKey: ${areaKey}
activePage: ${areaKey}
permalink: ${permalink}
---
`;
      const pagination = buildPagination(areaKey, weekNum);
      const contentWithoutPagination = content.replace(/\s*<div class="pagination_section">[\s\S]*?<\/div>\s*$/i, '').trim();
      const fullContent = contentWithoutPagination + '\n\n' + pagination;
      const njkPath = path.join(fullDir, outFileName);
      fs.writeFileSync(njkPath, frontMatter + fullContent, 'utf8');
      count++;
      console.log('Wrote', njkPath);
    }
  }
  console.log('Done. Converted', count, 'week pages.');
}

main();
