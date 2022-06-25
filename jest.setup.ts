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

// @ts-ignore
window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
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

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
