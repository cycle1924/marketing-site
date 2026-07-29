# Lessons

Running log of non-obvious gotchas found while working in this repo.
Format: `- YYYY-MM-DD | <area> | <observation>`

- 2026-07-29 | harness | marketing-site runs in Claude Code Web, one designated branch per session, no worktrees, no gh CLI, so prompts must specify one PR per session
- 2026-07-29 | pricing page | the /pricing page reports horizontal overflow at 390px (scrollWidth 501 vs 390) on main and on any branch, because .compare sets min-width 800px inside the .compare-wrap overflow-x container; this is the intended scroll pattern, not a regression, so do not treat an overflow assertion failure there as caused by your change
- 2026-07-29 | harness | the stop hook flags GitHub squash-merge commits on main as Unverified because their committer is GitHub <noreply@github.com>; when a branch is freshly reset to main and carries no local commits this is a false positive, so do not amend or rebase it away, that would rewrite merged history
- 2026-07-29 | header nav | the mobile menu has no Book a demo button; global.css hides it below 720px via .nav .nav-cta .btn:not(.nav-toggle) { display: none }, so the open menu is the nav-links list only; also desktop nav and mobile menu are the same #navLinks markup in Layout.astro, toggled by an .open class, not separate components
