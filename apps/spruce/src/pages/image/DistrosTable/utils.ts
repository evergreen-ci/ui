const distroSuffixRegex = /-(\d*)(xx|x)?(small|large|medium)$/i;

/**
 * Extracts the base distro name by removing size suffixes like -small, -medium, -large, -xlarge, etc.
 * @param distroName - The full distro name
 * @returns The base distro name without size suffix
 */
export const getBaseDistroName = (distroName: string): string =>
  distroName.replace(distroSuffixRegex, "");

const baseRanks: Record<string, number> = {
  xxsmall: 0,
  xsmall: 1,
  small: 2,
  medium: 3,
  large: 4,
  xlarge: 5,
  xxlarge: 6,
};

/**
 * Extracts a numeric rank for size suffixes to enable proper sorting.
 * Order: xxsmall < xsmall < small < medium < large < xlarge < xxlarge < 2xlarge < 4xlarge < 8xlarge...
 * @param distroName - The full distro name
 * @returns A numeric rank for sorting
 */
export const getSizeRank = (distroName: string): number => {
  const match = distroName.match(distroSuffixRegex);

  // If there is no suffix, sort to the end.
  if (!match) {
    return 999;
  }

  const [, numPrefix, xPrefix, baseSuffix] = match;
  const num = numPrefix ? parseInt(numPrefix, 10) : 0;

  // Handles suffixes that start with x.
  if (xPrefix && !num) {
    const key = `${xPrefix}${baseSuffix.toLowerCase()}`;
    return baseRanks[key] ?? 999;
  }

  if (!xPrefix && !num) {
    const key = baseSuffix.toLowerCase();
    return baseRanks[key] ?? 999;
  }

  // Handles (d)xlarge (2xlarge, 4xlarge, 16xlarge, etc.).
  if (xPrefix && baseSuffix.toLowerCase() === "large" && num) {
    return 100 + num;
  }

  // Handles (d)xsmall.
  if (xPrefix && baseSuffix.toLowerCase() === "small" && num) {
    return -num;
  }

  return 999;
};
