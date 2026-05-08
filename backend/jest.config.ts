import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.ts"],
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  clearMocks: true
};

export default config;
