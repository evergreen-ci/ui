export type CustomKeyValueRenderConfig = {
  [prefixKey: string]: (value: string) => React.ReactElement;
};

/**
 * `applyCustomKeyValueRender` is a utility function that applies custom rendering logic to key-value pairs.
 * @param key - The key of the object.
 * @param value - The value of the object.
 * @param customRenderConfig - A configuration object that maps prefixes to custom render functions.
 * @returns - The rendered value.
 */
export const applyCustomKeyValueRender = (
  key: string,
  value: string,
  customRenderConfig: CustomKeyValueRenderConfig,
): string | React.ReactElement => {
  const prefixes = Object.keys(customRenderConfig);
  const prefix = prefixes.find((prefixKey) => key.startsWith(prefixKey));

  if (prefix) {
    return customRenderConfig[prefix](value);
  }
  return value;
};
