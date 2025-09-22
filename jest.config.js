module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  collectCoverageFrom: ['assets/js/main.js'],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
