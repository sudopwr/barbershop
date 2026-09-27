// @testing-library/react-native registers its Jest matchers (toBeOnTheScreen, …) automatically.

// Safe-area insets don't exist in Jest; use the library's official mock
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
