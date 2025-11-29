/**
 * Jest configuration for PayXOne monorepo
 * For details: https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Node environment for backend/core tests
  testEnvironment: 'node',

  // Match test files
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],

  // Ignore node_modules
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],

  // Transform TypeScript files using ts-jest
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // Support path aliases like @payxone/core
  moduleNameMapper: {
    '^@payxone/(.*)$': '<rootDir>/packages/$1/src',
  },

  // File extensions Jest should handle
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],

  // Coverage reporters
  coverageReporters: ['text', 'lcov'],
};

export default config;
