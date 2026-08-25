# Portfolio — Dohyun Yang

Working directory. Each project folder holds `writeup.md` plus a `figures/` subfolder.
Assembled into a static site at the end.

## Project order (site nav)

| # | Folder | Status |
|---|---|---|
| 01 | b27-rear-wing | Not started — flagship, largest page |
| 02 | flow-visualization | Not started — only true correlation item, high priority |
| 03 | fw-mounting-position | **Draft complete**, figures need revision |
| 04 | radiator-characterization | Not started |
| 05 | hpc-pipeline | Not started |
| 06 | navier-stokes-solver | Not started — link repo |
| 07 | wind-tunnel | Not started — build log, in progress |
| 08 | airfoilnet | Not started |
| 09 | composites | Not started — short, image-led |

## Writeup template

1. Summary (write last)
2. Problem — constraints, what was wrong before
3. Method — setup table, then narrative
4. Results — findings, figures inline
5. Outcome — what decision it drove
6. Limitations
7. Figure inventory (working notes; strip before publishing)

Target 600–1000 words of body text per project, figure-led.

## Conventions

- Downforce positive throughout; note where solver output differs
- State reference velocity and area on every CFD page
- Half-car vs full-car labeled explicitly on every force number
- Attribution: state per project what was owned vs contributed to
- No claim below the stated numerical noise floor

## Global TODOs

- [ ] Reference velocity and frontal area for Cl/Cd normalization
- [ ] What the ~15 N Total_Aero_DF vs Total_DF difference represents (wheel lift?)
- [ ] Confirm final B27 downforce delta figure and reference speed (38% vs 48%)
- [ ] Shoot/collect oil-flow images off phone, straight-on, wide + crops
- [ ] Add force monitor CSV export to team post-processing macro (prevents §2 gap recurring)
