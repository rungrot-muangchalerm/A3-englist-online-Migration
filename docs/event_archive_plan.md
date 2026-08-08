# Safe Archive Plan for assets/event/ (Revised After Database Check)

## Goal

Reduce repository size by removing unused event assets while avoiding broken images in production.

> **Critical update:** The database check found **391 event URLs** inside `tbl_web_topic.topic_detail` (73 rows). Many folders previously considered "unused" are referenced in old forum/news content. The archive plan below now separates **safe-to-archive** folders from **database-referenced** folders.

## Phase 1: Pre-Archive Verification (Before moving anything)

### 1.1 Database Check

A local scan of `engtest_online` found references only in `tbl_web_topic.topic_detail`. Run this query on production to confirm:

```sql
-- Count rows and URLs
SELECT COUNT(*) AS rows_with_event_urls
FROM tbl_web_topic
WHERE topic_detail LIKE '%event/%';

-- Show topics that reference event assets
SELECT topic_id, type_id, topic_active, topic_name
FROM tbl_web_topic
WHERE topic_detail LIKE '%event/%'
ORDER BY topic_id DESC;

-- Show which topics are still active
SELECT topic_id, type_id, topic_active, topic_name
FROM tbl_web_topic
WHERE topic_detail LIKE '%event/%' AND topic_active = '1';
```

If production uses different table names, adjust accordingly. The key columns to scan are `topic_detail`, `topic_image`, and any CMS content columns that may store HTML.

### 1.2 Access Log Check

Check production web server logs for requests to `/event/...` paths in the last 3-6 months.

```bash
# Example for Nginx
grep -oE '/event/[^ ]+' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -100

# Example for Apache
grep -oE '/event/[^ ]+' /var/log/apache2/access.log | sort | uniq -c | sort -rn | head -100
```

If a folder receives traffic, it should NOT be archived even if not referenced in code or DB.

**Note:** This local dev environment does not have web server access logs. This check must be done on production.

### 1.3 Backup

Before any move, ensure the repo is backed up and the working tree is clean.

```bash
git status
git log --oneline -1
```

## Phase 2: Archive Only the Confirmed-Unused Folders

> **Executed on 2026-08-08.** The 23 folders listed below were moved to `assets/event/_archive_2026_08_09/` using `tools/event-cleanup/archive_safe_event_folders.js`. Total archived size: 260.18 MB (including 2 standalone files).

These 23 folders have **no references** in code, views, or database. They are the only safe initial archive batch.

```bash
# Create archive directory (do NOT commit this into repo, or use .gitignore)
mkdir assets/event/_archive_2026_08_09

# Move only the confirmed-unused folders (~256 MB total)
mv "assets/event/2025" assets/event/_archive_2026_08_09/
mv "assets/event/EOL Corporate Package 2021" assets/event/_archive_2026_08_09/
mv "assets/event/Personal" assets/event/_archive_2026_08_09/
mv "assets/event/BACKTO SCHOOL 2021" assets/event/_archive_2026_08_09/
mv "assets/event/TEOC9" assets/event/_archive_2026_08_09/
mv "assets/event/EOL Corporate Package Training 2022" assets/event/_archive_2026_08_09/
mv "assets/event/Gepot 18" assets/event/_archive_2026_08_09/
mv "assets/event/Daily English Tenses 2019" assets/event/_archive_2026_08_09/
mv "assets/event/BACKTO SCHOOL 2022" assets/event/_archive_2026_08_09/
mv "assets/event/new banner" assets/event/_archive_2026_08_09/
mv "assets/event/EOL Corporate System Package Training 2022" assets/event/_archive_2026_08_09/
mv "assets/event/Summer Ontour64" assets/event/_archive_2026_08_09/
mv "assets/event/TEOC11" assets/event/_archive_2026_08_09/
mv "assets/event/taluy_examination" assets/event/_archive_2026_08_09/
mv "assets/event/Intelligence2023" assets/event/_archive_2026_08_09/
mv "assets/event/O-net 10per" assets/event/_archive_2026_08_09/
mv "assets/event/Intelligent Package Reading" assets/event/_archive_2026_08_09/
mv "assets/event/Map" assets/event/_archive_2026_08_09/
mv "assets/event/One day" assets/event/_archive_2026_08_09/
mv "assets/event/Everyday Eng" assets/event/_archive_2026_08_09/
mv "assets/event/Easy English" assets/event/_archive_2026_08_09/
mv "assets/event/Colum" assets/event/_archive_2026_08_09/
mv "assets/event/GHB" assets/event/_archive_2026_08_09/

# Also archive the 2 standalone files at the event root
mv "assets/event/banner-teoc9.png" assets/event/_archive_2026_08_09/
mv "assets/event/poster-teoc9.png" assets/event/_archive_2026_08_09/
```

**Important:** Do NOT move the following folders without first addressing their database references:

- `TEOC5/` (543.83 MB, 252 DB URLs) — biggest risk
- `TEOC7/`, `TEOC6/`, `TEOC8/`, `TEOC10/`
- `Intelligence2020/`, `Intelligence2021/`, `Intelligence2024/`
- `English-Camp-2023/`, `activities-2023/`, `OPEN_HOUSE_2024/`, `EOL-Camp-2024/`
- `Newyears2020/`, `Newyears2021/`, `Newyears2022/`, `Newyears2023/`, `Newyears2024/`
- `Summer_Oct2019/`, `Summer64/`, `summer-course-2023/`
- `Package-against-Covid/`, `effective-writing/`, `Seminar2019/`, `Lets_celebrate/`
- `Business-Partner-TEOC8/`, `korpor-course-2023/`, `open-house-eol-2023/`, `member-club-half-year-2023/`
- `EOL-Individual-Tutorial/`, `course_basic_2024/`, `course_intermediate_2024/`

## Phase 3: Address Database-Referenced Folders (Optional)

If you want to reclaim the ~756 MB locked in DB-referenced folders, choose one of these approaches per folder:

1. **Update content** — run SQL to replace old event URLs with CDN URLs or remove the images:

   ```sql
   -- Example: replace a specific event URL across all topic_detail rows
   UPDATE tbl_web_topic
   SET topic_detail = REPLACE(topic_detail, 'https://www.engtest.net/event/TEOC5/', 'https://cdn.example.com/TEOC5/')
   WHERE topic_detail LIKE '%event/TEOC5/%';
   ```

2. **Confirm inactivity** — if the topics are old and `topic_active = '0'`, they may be safe to archive after a log check confirms zero traffic.

3. **Accept broken images** — not recommended for public-facing topics.

## Phase 4: Monitoring Period

Monitor for 30-90 days after any archive:

- Server error logs for 404s on `/event/...`
- User complaints about missing images
- Database error reports
- Access logs to see if `_archive_2026_08_09` is requested (should be zero)

If any broken image is reported, restore the folder immediately from archive.

## Phase 5: Permanent Deletion

After the monitoring period with no issues:

1. Delete the `_archive_2026_08_09` directory.
2. Update `.gitignore` to exclude future archive directories:
   ```gitignore
   assets/event/_archive_*/
   ```
3. Commit the cleanup.

## Phase 6: Prevent Future Accumulation

Establish policy:

- Each new campaign gets its own folder under `assets/event/YYYY-campaign-name/`.
- When a campaign ends, after 6-12 months, move its folder to archive.
- Review `assets/event/` every 6 months.
- Prefer storing large media on CDN/S3 instead of in the repo.
- When content is stored in the DB (e.g., `topic_detail`), keep a record of which asset folders it references.

## Rollback Plan

If a problem occurs after archive:

```bash
mv assets/event/_archive_2026_08_09/2025 assets/event/
# Restore other folders as needed
```

Restore and restart the monitoring period.

## Helper Scripts

The following scripts were created during this analysis:

- `tools/event-cleanup/find_event_refs.js` — searches code/views for event folder references
- `tools/event-cleanup/event_inventory_report.js` — lists all event folders, sizes, and code reference counts
- `tools/event-cleanup/check_db_event_refs.js` — scans all DB text columns for `%event/%`
- `tools/event-cleanup/check_db_event_folder_refs.js` — extracts exact event folder references from `tbl_web_topic.topic_detail`
- `tools/event-cleanup/archive_safe_event_folders.js` — moves confirmed-safe folders into `assets/event/_archive_YYYY_MM_DD/`

These can be reused for future cleanup rounds.
