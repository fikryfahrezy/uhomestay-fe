/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/jest.setup.js
 *
 */

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch";

import "@testing-library/jest-dom";

import dotenv from "dotenv";
dotenv.config({ path: "./.env.test.local" });

import { server } from "./__mocks__/server";

// Ref: How to use Jest for testing a react component with localStorage?
// https://stackoverflow.com/a/65286435/12976234
const localStorageMock = (function () {
  let store: Record<string, string> = {};

  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Ref: Jest Mock IntersectionObserver
// https://stackoverflow.com/a/58888349/12976234
// @ts-ignore
window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// https://github.com/vercel/next.js/issues/7479#issuecomment-568431869
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {
        id: 1,
      },
      asPath: "",
      replace: jest.fn(),
    };
  },
}));

jest.mock("@/services/member", () => {
  const originalModule = jest.requireActual("@/services/member");

  return {
    ...originalModule,
    useAdmin: () => ({
      refetch: () => {},
    }),
    useMember: () => ({
      refetch: () => {},
    }),
  };
});

jest.mock("@sindresorhus/slugify", () => (str: string) => str);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
