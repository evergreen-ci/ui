#!/usr/bin/env vite-node --script

import { push, pushTags } from "../utils/git";
import { countdownTimer } from "../utils/shell";

process.env.VITE_SCRIPT_MODE = "1";

push();

await countdownTimer(
  10,
  (n) => `Waiting ${n}s for Evergreen to pick up the version.`,
);

pushTags();
