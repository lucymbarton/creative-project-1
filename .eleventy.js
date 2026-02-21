const { buildPaginationFromData } = require("./_data/weekNav.js");

module.exports = function (eleventyConfig) {
  // Pagination shortcode - renders week/area pagination from areaKey + permalink
  eleventyConfig.addShortcode("weekPagination", function (areaKey, permalink) {
    const pag = buildPaginationFromData(areaKey, permalink);
    if (!pag) return "";
    let html = '<div class="pagination_section">';
    if (pag.prevHref) html += `<a href="${pag.prevHref}"><<</a>`;
    for (const w of pag.weeks) {
      html += `<a href="${w.href}"${w.active ? ' class="active"' : ""}>${w.num}</a>`;
    }
    if (pag.nextHref) html += `<a href="${pag.nextHref}">>></a>`;
    return html + "</div>";
  });

  // Copy static assets to output
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("js");

  // BrowserSync serves _site by default; no custom serveStatic needed

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
