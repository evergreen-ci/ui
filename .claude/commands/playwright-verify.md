Verify a PR's changes in the browser using Playwright. Do NOT make any code changes.

The user will provide a PR number, PR URL, or branch name: $ARGUMENTS. If not provided, verify the current branch.

## Step 0: Safely Check Out the PR

**Before doing anything, protect the user's local work:**
1. Run `git status` to check for uncommitted changes
2. Run `git log origin/HEAD..HEAD` to check for unpushed commits
3. If either exists, **stop and ask the user** how they want to proceed (stash, commit, or abort)
4. Only after confirming a clean state, check out the PR using `gh pr checkout <number>`
5. Note the user's original branch so you can offer to switch back when done

## Step 1: Understand the Changes

1. Run `gh pr view <number>` to get the PR description
2. Run `git diff main...HEAD --name-only` to identify changed files
3. Determine which pages/features are affected and need browser verification

## Step 2: Playwright Verification

Follow the Playwright / Browser Verification guidelines in AGENTS.md:
1. Confirm the dev server is already running (do not start one)
2. Navigate to the relevant pages affected by the changes
3. Wait for pages to load using `browser_wait_for`
4. Take screenshots of the affected UI and save to `.playwright-mcp/` to check for visual regressions
5. Check `browser_console_messages` and `browser_network_requests` for errors or regressions
6. Verify the feature works in QA like fashion. Ask the user before taking any possible destructive action.
7. Test out features that may have broken due to the code changes.
8. **Do NOT modify code** to finish implementing or fix issues — only make small targeted edits to unblock testing (e.g. stubbing an env check), revert them afterward, and inform the user

## Step 3: Summary

Provide a summary with:
- **Playwright results**: What you verified, any console errors or network failures, screenshots taken
- **Overall assessment**: Any blocking issues or concerns
- **Original branch**: Remind the user what branch they were on and offer to switch back
