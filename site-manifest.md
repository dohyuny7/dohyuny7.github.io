# Site manifest

Display order for the project nav. Folder names no longer carry numeric
prefixes (clean URLs), so this file is the source of truth for ordering.

| Order | Folder | Status |
|---|---|---|
| 1 | b27-rear-wing | Paused, downforce numbers still being reconciled |
| 2 | aero-validation | Done |
| 3 | fw-mounting-position-study | Done, missing 5 of 7 cp-bottom renders |
| 4 | radiator-characterization | Not started |
| 5 | hpc-pipeline | Done |
| 6 | navier-stokes-solver | Done, all 9 figures in |
| 7 | wind-tunnel | Build log only, CAD done, printing in progress |
| 8 | airfoilnet | Not started, codebase wiped, needs rebuild |
| 9 | composites-manufacturing | Done |

## Naming convention

- Folders: lowercase, hyphenated, no numeric prefix
- Markdown: always `<folder-name>.md`, exactly matching the folder
- Images: lowercase, hyphenated, descriptive; sequential steps get a
  zero-padded two-digit prefix (01-, 02-...)
- Exception: signed numeric station values (e.g. `+0.375`, `-0.250`) keep
  an underscore before the descriptive part, since a hyphen directly after
  a minus sign is ambiguous to read
- Extensions: lowercase, `.jpg` not `.jpeg`, `.mp4` for video (not `.mpg`,
  browsers won't play it)
