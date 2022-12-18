module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  setupFilesAfterEnv: [
    "./es-22/src/lib/prisma/client.mock.ts",
    "./es-22/src/lib/middleware/multer.mock.ts",
    "./es-22/src/lib/middleware/passport.mock.ts",
  ],

  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
