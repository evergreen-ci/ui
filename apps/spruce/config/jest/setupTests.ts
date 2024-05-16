// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
// @ts-ignore: FIXME. This comment was added by an automated script.
import MutationObserver from "mutation-observer";

// @ts-ignore
global.MutationObserver = MutationObserver;

// @ts-ignore
window.crypto.randomUUID = (() => {
  let value = 0;
  return () => {
    value += 1;
    return value.toString();
  };
})();
