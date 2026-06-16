# CCS Learner prototype

The student-facing (learner) side of the CCS Cross-Enrollment (CVC) Collaboratives flow. Static HTML, CSS, and JS — no build step. It's the third prototype alongside the super-admin (`ccs-collab-prototype`) and campus-admin (`campus-admin-prototype`) repos, and reuses the same CVC token palette.

**Live demo:** https://fanniharsanyi.github.io/learner-prototype/

## The flow

1. **`collaboratives.html` — Regional Collaboratives.** The explore landing: filter by home institution and browse collaborative cards (with "your home institution invited" pills and partner-college tags).
2. **`collaborative-detail.html` — a collaborative's programs.** Banner plus the list of programs inside the collaborative. (Added so the path is Explore → Collaborative → Program; the Figma node jumped straight from explore to a program.)
3. **`program-detail.html` — the program (Registered Nursing).** About, a 3-step "how it works" (Select → Enroll → Track), contact info, and the **program requirements** with the same AND / OR / "choose one" / "home institution only" logic as the admin side, shown with learner progress: Completed / In Progress pills, progress bars, enrolled courses, and "View available courses."

`index.html` redirects to `collaboratives.html`.

## What's interactive

- **Filter** on the explore page (acknowledges the selection).
- **Navigation** through Explore → Collaborative → Program.
- **View available courses** opens a course list; adding a course drops it into "My enrolled courses," advances the progress bar, and flips the requirement to **Completed** once its units are met. (The course list is a simple prototype stand-in — course browsing isn't in the Figma yet.)
- **Request More Information**, Terms download, and Search for Classes fire toasts.

## Run it

Open `collaboratives.html` in a browser. No server or build needed.

## Deploying

Static site on GitHub Pages, served from `main` / root. Push changes and Pages redeploys in a minute. Bump the `?v=N` on the `assets/` links when you change CSS or JS, to dodge the browser cache.

## Notes / assumptions

- The **collaborative-detail** page and the **available-courses** list were added to complete the flow; they aren't in the current Figma node, so they're sensible stand-ins.
- Only the Southern CA Health Sciences Network → Registered Nursing path is fully built; other collaboratives and programs are realistic placeholders.
- The CCC seal and partner logos are simple approximations for the prototype.
