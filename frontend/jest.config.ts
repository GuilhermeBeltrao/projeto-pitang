import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json"
    }
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  testMatch: ["<rootDir>/src/tests/**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  transform: {
    "^.+\\.[tj]sx?$": ["ts-jest", { "useESM": true }]
  },
  transformIgnorePatterns: ["/node_modules/(?!axios|@testing-library)"],
  clearMocks: true
};

export default config;
