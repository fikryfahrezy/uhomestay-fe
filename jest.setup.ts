/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/jest.setup.js
 *
 */

// Polyfill "window.fetch" used in the React component.
import "whatwg-fetch";

import "@testing-library/jest-dom/extend-expect";

import dotenv from "dotenv";
dotenv.config({ path: "./.env.test.local" });

import { server } from "./__mocks__/server";

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

// @ts-ignore
window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
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
