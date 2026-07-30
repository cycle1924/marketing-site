# Lessons

Running log of non-obvious gotchas found while working in this repo.
Format: `- YYYY-MM-DD | <area> | <observation>`

- 2026-07-29 | harness | marketing-site runs in Claude Code Web, one designated branch per session, no worktrees, no gh CLI, so prompts must specify one PR per session
- 2026-07-29 | page overflow | horizontal overflow at 390px had two causes, neither of them the wide comparison table: on /pricing the absolutely positioned .visually-hidden spans in the dash cells resolved against the initial containing block because .compare-wrap was position static, so they escaped the overflow-x container unclipped and set scrollWidth to 501; on all five pages .footer-signup min-content 375px blew the bare 1fr .footer-grid track past its 350px container for 5px more; fixed by position relative on .compare-wrap, and minmax(0, 1fr) on the track plus min-width 0 on the signup input, which are both needed since neither contains the row alone
- 2026-07-29 | debugging | when hunting page-level overflow, an element inside an overflow-x auto container does not contribute to documentElement.scrollWidth, but an absolutely positioned descendant whose containing block is outside that container does; walk ancestors for a positioned containing block, not just for overflow, or you will blame the wrong element
- 2026-07-29 | harness | the stop hook flags GitHub squash-merge commits on main as Unverified because their committer is GitHub <noreply@github.com>; when a branch is freshly reset to main and carries no local commits this is a false positive, so do not amend or rebase it away, that would rewrite merged history
- 2026-07-29 | header nav | the mobile menu has no Book a demo button; global.css hides it below 720px via .nav .nav-cta .btn:not(.nav-toggle) { display: none }, so the open menu is the nav-links list only; also desktop nav and mobile menu are the same #navLinks markup in Layout.astro, toggled by an .open class, not separate components
