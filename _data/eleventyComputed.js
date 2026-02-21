function getPageTitle(data) {
  const url = data.page?.url;
  const areaKey = data.areaKey;
  const areas = data.areas;
  if (areaKey && areas?.[areaKey]) {
    const area = areas[areaKey];
    const match = url?.match(/week(\d+)\.html/);
    if (match) return `Week ${match[1]} – ${area.name}`;
    return area.name;
  }
  if (data.activePage === "home") return "Home";
  if (data.activePage === "aboutMe") return "About Me";
  if (data.activePage === "slideshow") return "Photos";
  return null;
}

module.exports = {
  eleventyComputed: {
    title: (data) => getPageTitle(data),
  },
};
