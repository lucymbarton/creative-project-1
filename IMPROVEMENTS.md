# Improvement Notes

## Area Hub Pagination (Completed)

The area hub pages (mtc.njk, h8.njk, manvel.njk, etc.) each show the first week of that area and have pagination with << and >>. The reusable pagination system (`_data/weekNav.js` + `_includes/pagination.njk` + `_data/eleventyComputed.js`) now drives both area hubs and week pages, so behavior is consistent.

**What the reusable pagination does:**
- **<< (previous):** On area hubs, goes to the last week of the previous area. On week 1 (MTC), there is no previous.
- **>> (next):** On the last week of each area, goes to the first week of the next area (or next area hub). On week 75, there is no next.

**How to change it:** Edit `_data/weekNav.js` and update `buildPaginationForPage()`. The logic is based on `_data/areas.js` and the area order.

---

## Share Links (Ideas)

Share links let someone open a specific week or area directly from a URL.

**Current state:** URLs are already shareable:
- `/pages/sealy.html` – Sealy area hub (first week)
- `/pages/sealyWeeks/week21.html` – Week 21 in Sealy
- `/index.html` – Home

**Possible enhancements:**
1. **Copy link button:** Add a “Copy link” button on each week/area page that copies the current URL to the clipboard.
2. **Social share:** Optional Open Graph / Twitter meta tags so shared links look good on social media.
3. **Anchor links:** Add `id` attributes (e.g. `id="week21"`) so links like `/pages/sealyWeeks/week21.html#week21` scroll to the right section if the page grows.

**Minimal implementation (copy link):** Add this to area/week layouts:
```html
<button onclick="navigator.clipboard.writeText(window.location.href)">Copy link</button>
```
