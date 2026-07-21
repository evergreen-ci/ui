export type DurationMode = "custom" | "default" | "disabled";
export const DEFAULT_ADMIN_DURATION = "0s";
export const DISABLED_ADMIN_DURATION = "-1s";

type DurationComponent = {
  unit: DurationUnit;
  value: string;
};

type ParsedDuration = {
  components: DurationComponent[];
  nanoseconds: bigint;
  sign: -1 | 1;
};

type DurationUnit = "ns" | "us" | "µs" | "ms" | "s" | "m" | "h" | "d" | "w";

const MAX_DURATION_NANOSECONDS = 9223372036854775807n;
const DURATION_COMPONENT = /(\d+(?:\.\d*)?|\.\d+)(ns|us|µs|ms|s|m|h|d|w)/gy;

const NANOSECONDS_PER_UNIT: Record<DurationUnit, bigint> = {
  ns: 1n,
  us: 1000n,
  µs: 1000n,
  ms: 1000000n,
  s: 1000000000n,
  m: 60000000000n,
  h: 3600000000000n,
  d: 86400000000000n,
  w: 604800000000000n,
};

const UNIT_LABELS: Record<DurationUnit, [string, string]> = {
  ns: ["nanosecond", "nanoseconds"],
  us: ["microsecond", "microseconds"],
  µs: ["microsecond", "microseconds"],
  ms: ["millisecond", "milliseconds"],
  s: ["second", "seconds"],
  m: ["minute", "minutes"],
  h: ["hour", "hours"],
  d: ["day", "days"],
  w: ["week", "weeks"],
};

export const parseAdminDuration = (value: string): ParsedDuration | null => {
  let remaining = value;
  let sign: ParsedDuration["sign"] = 1;

  if (remaining.startsWith("-") || remaining.startsWith("+")) {
    sign = remaining.startsWith("-") ? -1 : 1;
    remaining = remaining.slice(1);
  }

  if (!remaining) {
    return null;
  }

  const components: DurationComponent[] = [];
  let nanoseconds = 0n;
  let parsedLength = 0;

  DURATION_COMPONENT.lastIndex = 0;
  let match = DURATION_COMPONENT.exec(remaining);
  while (match) {
    const componentValue = match[1];
    const unit = match[2] as DurationUnit;
    const [whole = "0", fraction = ""] = componentValue.split(".");
    const scale = 10n ** BigInt(fraction.length);
    const numerator = BigInt(`${whole || "0"}${fraction}`);
    const scaledNanoseconds = numerator * NANOSECONDS_PER_UNIT[unit];
    if (scaledNanoseconds % scale !== 0n) {
      return null;
    }
    const componentNanoseconds = scaledNanoseconds / scale;

    nanoseconds += componentNanoseconds;
    if (nanoseconds > MAX_DURATION_NANOSECONDS) {
      return null;
    }

    components.push({ unit, value: componentValue });
    parsedLength = DURATION_COMPONENT.lastIndex;
    match = DURATION_COMPONENT.exec(remaining);
  }

  if (!components.length || parsedLength !== remaining.length) {
    return null;
  }

  return { components, nanoseconds, sign };
};

export const getDurationMode = (value: string): DurationMode => {
  const parsed = parseAdminDuration(value);
  if (parsed?.nanoseconds === 0n) {
    return "default";
  }
  if (parsed?.sign === -1) {
    return "disabled";
  }
  return "custom";
};

// TODO (DEVPROD-37602): Remove this after the admin duration migration is complete.
export const adminDurationFromLegacy = (
  value: string | null | undefined,
  legacyValue: number | null | undefined,
  legacyUnit: DurationUnit,
): string =>
  value ??
  (legacyValue ? `${legacyValue}${legacyUnit}` : DEFAULT_ADMIN_DURATION);

export const validateAdminDuration = (value: string): boolean =>
  parseAdminDuration(value) !== null;

export const validateCustomDuration = (value: string): boolean => {
  const parsed = parseAdminDuration(value);
  return parsed !== null && parsed.sign === 1 && parsed.nanoseconds > 0n;
};

export const humanizeAdminDuration = (value: string): string | null => {
  const parsed = parseAdminDuration(value);
  if (!parsed || parsed.sign === -1 || parsed.nanoseconds === 0n) {
    return null;
  }

  return parsed.components
    .map(({ unit, value: componentValue }) => {
      const [singular, plural] = UNIT_LABELS[unit];
      const normalizedValue = componentValue
        .replace(/^0+(?=\d)/, "")
        .replace(/\.0+$/, "");
      return `${componentValue} ${normalizedValue === "1" ? singular : plural}`;
    })
    .join(", ");
};
