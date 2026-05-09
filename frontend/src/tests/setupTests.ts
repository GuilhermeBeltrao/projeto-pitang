import "@testing-library/jest-dom";

// Mock the api module to avoid import.meta errors during module load
jest.mock("../services/api", () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }
}));

// Silence specific React Router future-flag warnings during tests
const origWarn = console.warn;
console.warn = (...args: unknown[]) => {
  try {
    const msg = String(args[0] ?? "");
    if (msg.includes("React Router Future Flag Warning") || msg.includes("Relative route resolution within Splat routes")) {
      return;
    }
  } catch (e) {
    // ignore
  }
  return origWarn.apply(console, args as any);
};
