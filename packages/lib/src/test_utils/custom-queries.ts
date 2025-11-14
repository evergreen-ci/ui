import {
  queryHelpers,
  buildQueries,
  AllByAttribute,
  GetErrorFunction,
} from "@testing-library/react";

type OmitFirstArg<F> = F extends (...args: infer Args) => infer R
  ? Args extends [unknown, ...infer Rest]
    ? (...args: Rest) => R
    : never
  : never;

// The queryAllByAttribute is a shortcut for attribute-based matchers
// You can also use document.querySelector or a combination of existing
// testing library utilities to find matching nodes for your query
const queryAllByDataCy: OmitFirstArg<AllByAttribute> = (...args) =>
  queryHelpers.queryAllByAttribute("data-cy", ...args);

const getMultipleErrorDataCy: GetErrorFunction = (_, dataCyValue) =>
  `Found multiple elements with the data-cy attribute of: ${dataCyValue}`;
const getMissingErrorDataCy: GetErrorFunction = (_, dataCyValue) =>
  `Unable to find an element with the data-cy attribute of: ${dataCyValue}`;

const [
  queryByDataCy,
  getAllByDataCy,
  getByDataCy,
  findAllByDataCy,
  findByDataCy,
] = buildQueries(
  queryAllByDataCy,
  getMultipleErrorDataCy,
  getMissingErrorDataCy,
);

const queryAllByDataTestid: OmitFirstArg<AllByAttribute> = (...args) =>
  queryHelpers.queryAllByAttribute("data-testid", ...args);

const getMultipleErrorDataTestid: GetErrorFunction = (_, dataTestidValue) =>
  `Found multiple elements with the data-testid attribute of: ${dataTestidValue}`;
const getMissingErrorDataTestid: GetErrorFunction = (_, dataTestidValue) =>
  `Unable to find an element with the data-testid attribute of: ${dataTestidValue}`;

const [
  queryByDataTestid,
  getAllByDataTestid,
  getByDataTestid,
  findAllByDataTestid,
  findByDataTestid,
] = buildQueries(
  queryAllByDataTestid,
  getMultipleErrorDataTestid,
  getMissingErrorDataTestid,
);

export {
  queryByDataCy,
  queryAllByDataCy,
  getByDataCy,
  getAllByDataCy,
  findAllByDataCy,
  findByDataCy,
  queryByDataTestid,
  queryAllByDataTestid,
  getByDataTestid,
  getAllByDataTestid,
  findAllByDataTestid,
  findByDataTestid,
};
