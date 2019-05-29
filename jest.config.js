module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/scripts/jest.setup.ts"],
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
