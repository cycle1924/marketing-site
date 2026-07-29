# Lessons

Running log of non-obvious gotchas found while working in this repo.
Format: `- YYYY-MM-DD | <area> | <observation>`

- 2026-07-29 | harness | marketing-site runs in Claude Code Web, one designated branch per session, no worktrees, no gh CLI, so prompts must specify one PR per session
- 2026-07-29 | pricing page | the /pricing page reports horizontal overflow at 390px (scrollWidth 501 vs 390) on main and on any branch, because .compare sets min-width 800px inside the .compare-wrap overflow-x container; this is the intended scroll pattern, not a regression, so do not treat an overflow assertion failure there as caused by your change
