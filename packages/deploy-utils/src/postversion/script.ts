#!/usr/bin/env -S vite-node --script

import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";

push();

await countdownTimer(
  10,
  (n) => `Waiting ${n}s for Evergreen to pick up the version.`,
);

pushTags();
