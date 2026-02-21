const fs = require("fs");
const path = require("path");

const files = [
  "pages/mtc.njk", "pages/h8.njk", "pages/manvel.njk", "pages/sealy.njk",
  "pages/galveston.njk", "pages/mocity.njk", "pages/jcgm.njk", "pages/friendswood.njk",
  "pages/mtcWeeks/mtcweek2.njk",
  ...["week4", "week5"].map((w) => "pages/h8Weeks/" + w + ".njk"),
  ...[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((w) => "pages/manvelWeeks/week" + w + ".njk"),
  ...[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((w) => "pages/sealyWeeks/week" + w + ".njk"),
  ...[44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54].map((w) => "pages/galvestonWeeks/week" + w + ".njk"),
  ...[55, 56, 57].map((w) => "pages/mocityWeeks/week" + w + ".njk"),
  ...[58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71].map((w) => "pages/jcgmWeeks/week" + w + ".njk"),
  ...[72, 73, 74, 75].map((w) => "pages/friendswoodWeeks/week" + w + ".njk"),
];

const includeStr = '\n{% include "pagination.njk" %}\n';

for (const f of files) {
  try {
    const fullPath = path.join(__dirname, "..", f);
    let content = fs.readFileSync(fullPath, "utf8");
    const start = content.indexOf('<div class="pagination_section">');
    if (start === -1) {
      console.log("Skip (no pagination):", f);
      continue;
    }
    const closeIdx = content.indexOf("</div>", start);
    const end = closeIdx + 6;
    content = content.slice(0, start) + includeStr + content.slice(end);
    fs.writeFileSync(fullPath, content);
    console.log("Updated", f);
  } catch (e) {
    console.error(f, e.message);
  }
}
