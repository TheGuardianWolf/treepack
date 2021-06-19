module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^~/(.*)': '<rootDir>/src/$1',
    '^/(.*)': '<rootDir>/$1'
  }
}
