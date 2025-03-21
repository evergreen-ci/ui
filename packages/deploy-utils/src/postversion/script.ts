#!/usr/bin/env -S VITE_SCRIPT_MODE=1 vite-node --script

import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";

push();

await countdownTimer(
  10,
  (n) => `Waiting ${n}s for Evergreen to pick up the version.`,
);

pushTags();
