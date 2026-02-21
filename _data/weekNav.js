const areas = require("./areas");

const AREA_ORDER = ["mtc", "h8", "manvel", "sealy", "galveston", "mocity", "jcgm", "friendswood"];

const AREA_PAGE = {
  mtc: "/pages/mtc.html",
  h8: "/pages/h8.html",
  manvel: "/pages/manvel.html",
  sealy: "/pages/sealy.html",
  galveston: "/pages/galveston.html",
  mocity: "/pages/mocity.html",
  jcgm: "/pages/jcgm.html",
  friendswood: "/pages/friendswood.html",
};

function getWeekFile(areaKey, weekNum) {
  const area = areas[areaKey];
  if (!area) return null;
  const isMtc = areaKey === "mtc";
  return isMtc && weekNum === 2
    ? "/pages/mtcWeeks/mtcweek2.html"
    : `/pages/${area.weeksDir}/week${weekNum}.html`;
}

function buildPaginationForPage(url) {
  if (!url || typeof url !== "string") return null;
  url = url.startsWith("/") ? url : "/" + url;

  // Area hub pages
  for (const areaKey of AREA_ORDER) {
    if (url === AREA_PAGE[areaKey]) {
      const area = areas[areaKey];
      const weeks = area.weekRange;
      const firstWeek = weeks[0];
      const idx = AREA_ORDER.indexOf(areaKey);
      const prevArea = idx > 0 ? AREA_ORDER[idx - 1] : null;
      const nextArea = idx < AREA_ORDER.length - 1 ? AREA_ORDER[idx + 1] : null;
      const prevHref =
        areaKey === "mtc"
          ? null
          : prevArea
            ? getWeekFile(prevArea, areas[prevArea].weekRange[areas[prevArea].weekRange.length - 1])
            : "/index.html";
      const nextHref =
        areaKey === "mtc"
          ? getWeekFile("mtc", 2)
          : nextArea
            ? AREA_PAGE[nextArea]
            : null;
      const weekLinks = weeks.map((w) => ({
        href: w === firstWeek ? AREA_PAGE[areaKey] : getWeekFile(areaKey, w),
        num: w,
        active: w === firstWeek,
      }));
      return { prevHref, weeks: weekLinks, nextHref };
    }
  }

  // Week pages
  const mtcMatch = url.match(/\/pages\/mtcWeeks\/mtcweek2\.html/);
  const weekMatch = url.match(/\/pages\/(\w+Weeks)\/week(\d+)\.html/);
  let areaKey, weekNum;
  if (mtcMatch) {
    areaKey = "mtc";
    weekNum = 2;
  } else if (weekMatch) {
    const dirMap = {
      h8Weeks: "h8", manvelWeeks: "manvel", sealyWeeks: "sealy", galvestonWeeks: "galveston",
      mocityWeeks: "mocity", jcgmWeeks: "jcgm", friendswoodWeeks: "friendswood",
    };
    areaKey = dirMap[weekMatch[1]];
    weekNum = parseInt(weekMatch[2], 10);
  }
  if (!areaKey || !weekNum) return null;

  const area = areas[areaKey];
  const weeks = area.weekRange;
  const weekIdx = weeks.indexOf(weekNum);
  if (weekIdx < 0) return null;

  const idx = AREA_ORDER.indexOf(areaKey);
  const nextArea = idx < AREA_ORDER.length - 1 ? AREA_ORDER[idx + 1] : null;
  const prevArea = idx > 0 ? AREA_ORDER[idx - 1] : null;
  const isFirstWeek = weekNum === weeks[0];
  const isLastWeek = weekNum === weeks[weeks.length - 1];

  let prevHref;
  if (isFirstWeek) prevHref = areaKey === "mtc" ? null : prevArea ? AREA_PAGE[prevArea] : "/index.html";
  else prevHref = weeks[weekIdx - 1] === weeks[0] ? AREA_PAGE[areaKey] : getWeekFile(areaKey, weeks[weekIdx - 1]);

  let nextHref;
  if (isLastWeek) nextHref = areaKey === "friendswood" ? null : nextArea ? AREA_PAGE[nextArea] : null;
  else nextHref = weeks[weekIdx + 1] === weeks[0] ? AREA_PAGE[areaKey] : getWeekFile(areaKey, weeks[weekIdx + 1]);

  const weekLinks = weeks.map((w) => ({
    href: w === weeks[0] ? AREA_PAGE[areaKey] : getWeekFile(areaKey, w),
    num: w,
    active: w === weekNum,
  }));

  return { prevHref, weeks: weekLinks, nextHref };
}

/** Build pagination from areaKey + optional permalink (for week pages). */
function buildPaginationFromData(areaKey, permalink) {
  if (!areaKey || !areas[areaKey]) return null;
  const normUrl = (permalink || "").startsWith("/") ? permalink : "/" + (permalink || "");
  const isAreaHub = !permalink || normUrl === AREA_PAGE[areaKey];
  if (isAreaHub) return buildPaginationForPage(AREA_PAGE[areaKey]);
  return buildPaginationForPage(normUrl);
}

module.exports = {
  buildPaginationForPage,
  buildPaginationFromData,
};
