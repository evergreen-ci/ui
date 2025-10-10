import Cookies from "js-cookie";
import { DISABLE_QUERY_POLLING } from "./cookies";

// 1000 ms = 1 second
export const SECOND = 1000;

export const DEFAULT_POLL_INTERVAL =
  Cookies.get(DISABLE_QUERY_POLLING) === "true" ? 0 : 60 * SECOND;
export const FASTER_POLL_INTERVAL = DEFAULT_POLL_INTERVAL / 3;
export const WATERFALL_PINNED_VARIANTS_KEY = "waterfall-pinned-variants";
export const TASK_TIMING_CONFIG_KEY = "task-timing-config";
