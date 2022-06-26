/**
 * Ref:
 * https://github.com/mswjs/examples/blob/master/examples/with-jest/src/mocks/handlers.js
 */
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// Setup requests interception using the given handlers.
export const server = setupServer(...handlers);
