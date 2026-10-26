schema_version: 1
requirement: The search index build reads every page once per heading. Make it read each page once.
stage: 6 Present
validation_state: PASS — npm test (full suite); lint N/A; build or type check N/A
review_state: reviewer, performance — no findings
risk_tier: Medium
approved_scope: read each page once before its headings loop; index shape and order unchanged
approval_verbatim: "User has approved your plan. You can now start coding." (the ExitPlanMode decision, transcript record 12); no human conditions
conditions_verbatim: none
non_goals: caching across builds; any change to the index shape
decisions: hoist the read; no cache
depth_band: Standard
repository_baseline: git, commit 4e1f0a2, no modified files
progress: completed=[slice 1: a build reads each page once — seen failing on the read count, then passing]; remaining=[]; blocked=[]
deviations: [test placed in test/build-index.test.js, not test/index-reads.test.js — CLAUDE.md:23 one test file per module; cost if wrong: none to behaviour, a reader looking for the plan's file name finds the test beside the builder's other tests]
