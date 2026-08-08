# Assets/Event Analysis Report (Revised After Database Check)

Generated: 2026-08-09
Revised: 2026-08-09 after verifying database references

## Summary

- Total event folders: 68
- Folders referenced in code/views: 16
- Folders referenced in database: 37
- Folders referenced in **both** code and database: 8
- Folders referenced in **only one** of code or database: 37
- Folders with **zero references** in code and database: **23**
- Total size of folders with zero references: **~256 MB**
- Total size of folders referenced in database: **~756 MB**
- Standalone files in `assets/event/` root: 2 (`banner-teoc9.png`, `poster-teoc9.png`)

> **Critical correction:** The initial code-only scan concluded 52 folders were unused. A database scan found that many of these folders are referenced inside `tbl_web_topic.topic_detail`, especially old forum/news posts. Only **23 folders** are truly safe to archive without further action.

## Database Check Results

A read-only scan of `engtest_online` found:

- **Table:** `tbl_web_topic`
- **Column:** `topic_detail`
- **Matching rows:** 73
- **Total event URLs found:** 391
- **Unique local folders referenced:** 37

### Top Database-Referenced Folders

| Folder | URL Count | Topic Rows | Size (MB) | Notes |
|--------|-------------|------------|-----------|-------|
| `TEOC5` | 252 | 3 | 543.83 | **Largest folder; heavily used in old topics** |
| `QR Payment` | 25 | 25 | 0.88 | Also used in current code/views |
| `TEOC7` | 17 | 4 | 44.98 | Old TEOC event |
| `TEOC6` | 11 | 3 | 20.80 | Old TEOC event |
| `Intelligence2020` | 5 | 2 | 4.88 | Old campaign |
| `English-Camp-2023` | 4 | 1 | 3.54 | DB-only |
| `Summer_Oct2019` | 3 | 1 | 12.63 | DB-only |
| `1yearscourse` | 3 | 2 | 48.46 | Also used in code/views |
| `TEOC8` | 3 | 1 | 17.00 | Old TEOC event |
| `activities-2023` | 3 | 2 | 2.06 | DB-only |
| `Intelligence2024` | 3 | 1 | 27.03 | Also used in old PHP only |

Other DB-referenced folders include: `Newyears2020`, `Newyears2021`, `Newyears2022`, `Newyears2023`, `Newyears2024`, `Summer64`, `Summer Ontour64`, `Intelligence2021`, `Intelligence2023`, `Package-against-Covid`, `effective-writing`, `course_basic_2024`, `course_intermediate_2024`, `Seminar2019`, `Lets_celebate`, `EOL-Individual-Tutorial`, `Business-Partner-TEOC8`, `korpor-course-2023`, `open-house-eol-2023`, `summer-course-2023`, `member-club-half-year-2023`, `OPEN_HOUSE_2024`, `EOL-Camp-2024`, `TEOC10`, `EOL-Member-Club`, `EOL Corporate Package 2023`, `EOL-Member-Club-2023`, `GPS_Test_2024`.

> **Implication:** Folders with database references cannot be archived without either (a) updating the `topic_detail` rows, (b) confirming the topics are inactive/deleted, or (c) accepting broken images on those topics.

## Risk Levels (Revised)

| Level | Meaning | Action |
|-------|---------|--------|
| **LOW** | Referenced in current EJS/views | Keep |
| **MEDIUM** | Referenced only in database or only in old PHP | Verify topic status / traffic before archiving |
| **HIGH** | No references in code or database | **Strongest candidate for archive** |

## LOW Risk — Keep

These folders are referenced in active EJS/views:

| Folder | RefCount | Files | SizeMB | Sample Paths |
|--------|----------|-------|--------|--------------|
| EOL Corporate Package 2022 | 2 | 3 | 1.22 | corporate.ejs, eol-platform.ejs |
| corporate-platform-2023 | 2 | 2 | 2.23 | eol-platform.ejs |
| EOL-Member-Club | 2 | 3 | 3.02 | eol-member-club.ejs |
| EOL 19th | 2 | 7 | 4.07 | index.ejs |
| GPS_Test_2024 | 2 | 4 | 6.35 | index.ejs |
| 1yearscourse | 2 | 20 | 48.46 | index.ejs, oneyear.ejs |
| EOL Personal Package 2022 | 1 | 3 | 2.33 | personal.ejs |
| EOL Corporate Package 2023 | 1 | 5 | 2.36 | product-eol-platform.ejs |
| EOL-Member-Club-2023 | 1 | 5 | 6.37 | eol-member-club.ejs |
| QR Payment | 2 | 4 | 0.88 | index.ejs |

> Several of these are also referenced in the database (e.g., `1yearscourse`, `QR Payment`).

## MEDIUM Risk — Verify Before Archiving

These folders are referenced in the database **or** only in the old `assets/images/index.php` landing page. They are **not** in active EJS views, so they may not be needed by the new Node.js app, but they could still serve content to users who visit old topics or the old PHP page.

### Referenced in Database (not in active views)

| Folder | DB URLs | SizeMB | Notes |
|--------|---------|--------|-------|
| TEOC5 | 252 | 543.83 | Largest folder; used in old topics |
| TEOC7 | 17 | 44.98 | Old TEOC event |
| TEOC6 | 11 | 20.80 | Old TEOC event |
| TEOC8 | 3 | 17.00 | Old TEOC event |
| Intelligence2020 | 5 | 4.88 | Old campaign |
| English-Camp-2023 | 4 | 3.54 | DB-only |
| Summer_Oct2019 | 3 | 12.63 | DB-only |
| activities-2023 | 3 | 2.06 | DB-only |
| Intelligence2024 | 3 | 27.03 | DB + old PHP only |
| Newyears2020 | 2 | 15.65 | DB-only |
| Newyears2021 | 2 | 1.52 | DB-only |
| Summer64 | 2 | 3.14 | DB-only |
| Intelligence2021 | 2 | 3.55 | DB-only |
| Package-against-Covid | 2 | 19.92 | DB-only |
| effective-writing | 2 | 1.00 | DB-only |
| Newyears2023 | 2 | 1.10 | DB-only |
| Newyears2024 | 2 | 12.97 | DB-only |
| course_basic_2024 | 2 | 3.46 | DB-only |
| course_intermediate_2024 | 2 | 2.58 | DB-only |
| Seminar2019 | 1 | 3.41 | DB-only |
| Lets_celebate | 1 | 0.65 | DB-only |
| Newyears2022 | 1 | 4.74 | DB-only |
| EOL-Individual-Tutorial | 1 | 7.54 | DB-only |
| Business-Partner-TEOC8 | 1 | 2.23 | DB-only |
| korpor-course-2023 | 1 | 4.81 | DB-only |
| open-house-eol-2023 | 1 | 4.68 | DB-only |
| summer-course-2023 | 1 | 2.86 | DB-only |
| member-club-half-year-2023 | 1 | 1.26 | DB-only |
| OPEN_HOUSE_2024 | 1 | 5.86 | DB-only |
| EOL-Camp-2024 | 1 | 3.72 | DB-only |
| TEOC10 | 1 | 2.73 | DB + old PHP only |

### Referenced Only in Old PHP Landing Page

| Folder | RefCount | Files | SizeMB | Notes |
|--------|----------|-------|--------|-------|
| EOL-SYSTEM-2024 | 1 | 4 | 24.57 | Old PHP only |
| EOL Personal Package 2024 | 1 | 4 | 11.59 | Old PHP only |
| EOL-Member-Club-2024 | 1 | 6 | 7.41 | Old PHP only |
| Corporate | 2 | 3 | 19.02 | Old PHP + eol-platform.ejs |

## HIGH Risk — Safe to Archive (No Code or DB References)

These 23 folders have **zero references** in source code, EJS views, and the database. They are the strongest candidates for archiving, but a production access-log check should still be performed before permanent deletion.

| Folder | Files | SizeMB | Notes |
|--------|-------|--------|-------|
| 2025 | 19 | 49.14 | Recent year folder, but unused |
| EOL Corporate Package 2021 | 14 | 32.82 | Outdated campaign |
| Personal | 11 | 27.55 | Generic name, no refs |
| BACKTO SCHOOL 2021 | 2 | 24.97 | Old campaign |
| TEOC9 | 5 | 24.90 | Old TEOC |
| EOL Corporate Package Training 2022 | 8 | 14.75 | Training event ended |
| Gepot 18 | 5 | 13.77 | Old event |
| Daily English Tenses 2019 | 5 | 9.81 | Very old |
| BACKTO SCHOOL 2022 | 3 | 9.46 | Old campaign |
| new banner | 5 | 8.24 | Ambiguous, possibly leftover |
| EOL Corporate System Package Training 2022 | 3 | 6.74 | Training ended |
| Summer Ontour64 | 2 | 6.40 | Old |
| TEOC11 | 3 | 5.55 | Unused |
| taluy_examination | 5 | 5.40 | Unused |
| Intelligence2023 | 3 | 4.96 | Unused |
| O-net 10per | 3 | 4.75 | Unused |
| Intelligent Package Reading | 3 | 2.37 | Unused |
| Map | 3 | 1.68 | Unused, generic name |
| One day | 5 | 1.29 | Unused |
| Everyday Eng | 4 | 1.01 | Unused |
| Easy English | 2 | 0.31 | Unused |
| Colum | 2 | 0.12 | Unused |
| GHB | 1 | 0.08 | Unused |
| **Total** | | **~256.07 MB** | |

## Standalone Files

| File | Size | RefCount | Notes |
|------|------|----------|-------|
| banner-teoc9.png | unknown | 0 | No reference in code or DB |
| poster-teoc9.png | unknown | 0 | No reference in code or DB |

## Important Caveats

1. **Database WAS checked.** `tbl_web_topic.topic_detail` contains 391 event URLs across 73 rows. Many "unused" folders are actually used in old forum/news content.
2. **Access logs not checked.** This is a local dev environment; no web server access logs are available. Production logs must be checked before archiving.
3. **Old PHP page:** `assets/images/index.php` may still be served on production. It references several folders not in the new Node.js views.
4. **DB references are content URLs:** They are embedded in `topic_detail` HTML. Archiving a referenced folder will break images on those topics unless the content is updated first.

## Recommended Next Steps

1. **Archive the 23 HIGH-risk folders first.** They have no code or DB references. Total ~256 MB.
2. **Do NOT archive MEDIUM-risk folders** (DB or old PHP references) without verifying topic status and traffic.
3. **Check production access logs** for `/event/...` requests.
4. **Investigate the 73 DB rows** to determine if topics are active (`topic_active = '1'`) and public.
5. **Move, don't delete** — use `assets/event/_archive_2026_08_09/` and monitor for 30–90 days.
6. **After monitoring**, permanently delete only confirmed-unused folders.
