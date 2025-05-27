export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@redux/(.*)$': '<rootDir>/src/redux/$1',
        '^@services/(.*)$': '<rootDir>/src/services/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};
