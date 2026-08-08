# Event Assets Cleanup — Executive Summary (Revised After DB Check)

Generated: 2026-08-08
Revised: 2026-08-08 after database verification

## ⚠️ Important Correction

The initial code-only analysis concluded that **52 folders** (~1,012 MB) were unused. After checking the database, this was **wrong**: many of those folders are referenced inside `tbl_web_topic.topic_detail` (old forum/news content). The actual set of folders that can be safely archived is much smaller.

## At a Glance

| Metric | Count |
|--------|-------|
| Total event folders under `assets/event/` | 68 |
| Folders referenced in code/views | 16 |
| Folders referenced in database (`tbl_web_topic.topic_detail`) | 37 |
| Folders referenced in **both** code and DB | 8 |
| Folders referenced in **only one** of code or DB | 37 |
| Folders with **no references at all** (truly unused) | **23** |
| Standalone files in `assets/event/` root | 2 (`banner-teoc9.png`, `poster-teoc9.png`) |
| Total size of truly unused folders | **~256 MB** |
| Total size of folders referenced in DB | **~756 MB** |

## Key Findings

1. **Database contains many event references.** `tbl_web_topic.topic_detail` has **73 rows** containing **391 event URLs** pointing to `https://www.engtest.net/event/...`.
2. **The biggest folder is used.** `TEOC5/` (543.83 MB) has **252 URLs** across 3 topic rows. It **cannot** be safely archived without updating those topics or accepting broken images.
3. **Only 23 folders are truly safe to archive.** These have no references in current code/views **and** no references in the database.
4. **Code-only analysis missed DB-only usage.** 29 folders are referenced only in the database (e.g., `TEOC5`, `TEOC7`, `Intelligence2020`, `activities-2023`).
5. **Some folders are referenced in both code and DB.** Examples: `1yearscourse`, `EOL-Member-Club`, `QR Payment`, `GPS_Test_2024`.
6. **Access logs are not available locally.** This repo is a local dev environment; no web server access logs were found. Production access logs must be checked separately.
7. **Two standalone files** (`banner-teoc9.png`, `poster-teoc9.png`) still have no references.

## Reference Breakdown

| Category | Folders | Examples |
|----------|---------|----------|
| Code + DB | 8 | `1yearscourse`, `EOL-Member-Club`, `QR Payment`, `GPS_Test_2024`, `TEOC10`, `Intelligence2024`, `EOL-Member-Club-2023`, `EOL Corporate Package 2023` |
| Code only | 8 | `EOL-SYSTEM-2024`, `EOL Personal Package 2024`, `EOL-Member-Club-2024`, `Corporate`, `EOL 19th`, `corporate-platform-2023`, `EOL Corporate Package 2022`, `EOL Personal Package 2022` |
| DB only | 29 | `TEOC5`, `TEOC7`, `TEOC6`, `TEOC8`, `Intelligence2020`, `activities-2023`, `English-Camp-2023`, `Package-against-Covid`, `effective-writing`, `Newyears2024`, etc. |
| Neither | **23** | `2025`, `Personal`, `TEOC9`, `TEOC11`, `Map`, `GHB`, `Colum`, etc. |

## Top Database-Referenced Folders (cannot archive without action)

| Folder | URLs in DB | Topic Rows | Size (MB) | Notes |
|--------|------------|------------|-----------|-------|
| `TEOC5` | 252 | 3 | 543.83 | Largest; heavily used in old topics |
| `QR Payment` | 25 | 25 | 0.88 | Also used in code/views |
| `TEOC7` | 17 | 4 | 44.98 | Old TEOC event |
| `TEOC6` | 11 | 3 | 20.80 | Old TEOC event |
| `Intelligence2020` | 5 | 2 | 4.88 | Old campaign |
| `English-Camp-2023` | 4 | 1 | 3.54 | Recent but DB-only |
| `Summer_Oct2019` | 3 | 1 | 12.63 | Old campaign |
| `1yearscourse` | 3 | 2 | 48.46 | Also used in code |
| `TEOC8` | 3 | 1 | 17.00 | Old TEOC event |
| `activities-2023` | 3 | 2 | 2.06 | DB-only |

## Truly Unused Folders (safe to archive after log check)

These 23 folders have **zero references** in code and **zero references** in the database:

| Folder | Size (MB) |
|--------|-----------|
| `2025` | 49.14 |
| `EOL Corporate Package 2021` | 32.82 |
| `Personal` | 27.55 |
| `BACKTO SCHOOL 2021` | 24.97 |
| `TEOC9` | 24.90 |
| `EOL Corporate Package Training 2022` | 14.75 |
| `Gepot 18` | 13.77 |
| `Daily English Tenses 2019` | 9.81 |
| `BACKTO SCHOOL 2022` | 9.46 |
| `new banner` | 8.24 |
| `EOL Corporate System Package Training 2022` | 6.74 |
| `Summer Ontour64` | 6.40 |
| `TEOC11` | 5.55 |
| `taluy_examination` | 5.40 |
| `Intelligence2023` | 4.96 |
| `O-net 10per` | 4.75 |
| `Intelligent Package Reading` | 2.37 |
| `Map` | 1.68 |
| `One day` | 1.29 |
| `Everyday Eng` | 1.01 |
| `Easy English` | 0.31 |
| `Colum` | 0.12 |
| `GHB` | 0.08 |
| **Total** | **~256.07 MB** |

## Risk Summary (Revised)

| Risk Level | Criteria | Examples | Approx. Size |
|------------|----------|----------|--------------|
| **LOW** | Referenced in active code/views | `1yearscourse`, `EOL Corporate Package 2022` | ~77 MB |
| **MEDIUM** | Referenced only in database or old PHP | `TEOC5`, `TEOC7`, `Intelligence2020` | ~756 MB |
| **HIGH** | Referenced in **neither** | 23 folders listed above | ~256 MB |

> **Note:** `HIGH` risk in this revised report means "safe to archive" (no references). The original report used the opposite convention; this summary flips it to match the actual meaning.

## Archive Completed

On 2026-08-08, the 23 truly unused folders and 2 standalone files were moved to:

```
assets/event/_archive_2026_08_09/
```

| Metric | Value |
|--------|-------|
| Items archived | 25 (23 folders + 2 standalone files) |
| Total size archived | **260.18 MB** |
| Archive directory | `assets/event/_archive_2026_08_09/` |
| Reversible | Yes — move folders back to `assets/event/` to restore |

The remaining folders in `assets/event/` still have code or database references and were **not** moved.

## Recommended Next Steps

1. **Monitor for 30–90 days.** Watch server error logs for 404s on `/event/...` paths and check for user complaints.
2. **Do NOT archive DB-referenced folders yet** without one of the following:
   - Updating the 73 `topic_detail` rows to use new URLs or CDN
   - Confirming the topics are inactive/deleted and receive no traffic
   - Accepting broken images on those topics
3. **Check production access logs** to see which `/event/...` URLs are still requested. This repo has no access logs locally.
4. **Investigate the 73 DB rows** to determine if the topics are active (`topic_active = '1'`) and public.
5. **After monitoring period**, permanently delete `_archive_2026_08_09/` if no issues are reported.
6. **Delete the 2 standalone files** (`banner-teoc9.png`, `poster-teoc9.png`) from the archive after monitoring if no references are found.

## Helper Scripts Created

All helper scripts are organized under `tools/event-cleanup/`:

- `tools/event-cleanup/find_event_refs.js` — searches code/views for references to event folders.
- `tools/event-cleanup/event_inventory_report.js` — lists all event folders, sizes, file counts, and code reference counts.
- `tools/event-cleanup/check_db_event_refs.js` — scans all DB text columns for `%event/%`.
- `tools/event-cleanup/check_db_event_folder_refs.js` — extracts exact event folder references from `tbl_web_topic.topic_detail`.
- `tools/event-cleanup/archive_safe_event_folders.js` — moves the confirmed-safe folders into `assets/event/_archive_YYYY_MM_DD/`.

See `tools/event-cleanup/README.md` for usage notes.
## Detailed Reports

- **Revised risk analysis**: `docs/event_assets_analysis.md`
- **Safe archive plan**: `docs/event_archive_plan.md`
