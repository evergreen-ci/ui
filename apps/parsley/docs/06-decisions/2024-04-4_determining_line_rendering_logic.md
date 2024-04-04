# 2024-04-04 Determining Log Line Rendering Logic

* status: accepted
* date: 2024-04-04
* authors: Arjun Patel

## Context and Problem Statement

Raw logs ingested by Parsley require a specific rendering algorithm so the HTML rendered my Parsley is a transformation of the raw log.
Before `DEVPROD-5130` and `DEVPROD-71`, the rendering algorithm was determined by the origin of the log, indicated by the app URL. This strict
requirement makes managing API data, app state, and app URL generation inflexible and tedious.

## Decision Outcome
After those code changes, the rendering algorithm is available from a GQL API field called `renderingType`. If that value is unavailable, then
the code will fall back to log origin or a default rendering algorithm. 