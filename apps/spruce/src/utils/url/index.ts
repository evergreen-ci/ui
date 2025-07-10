// Takes a query param and a value and returns an array
// if the query param already contains the value it does not modify it otherwise
// it will add the value to the query param
export const upsertQueryParam = (params: string[] | string, value: string) => {
  if (
    params === undefined ||
    (typeof params === "string" && params === value)
  ) {
    return [value];
  }
  if (Array.isArray(params) && params.find((param) => param === value)) {
    return [...params];
  }
  return Array.isArray(params) ? [...params, value] : [params, value];
};

// Takes a query param and returns the param WITHOUT the specified value
export const removeQueryParam = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    return param.filter((p) => p !== value);
  }
  return undefined;
};

export * from "./updateUrlQueryParam";
