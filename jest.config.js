export default {
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.m?js$': 'babel-jest', 
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'], 
};