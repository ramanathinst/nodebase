# Test Suite Documentation

## Overview
This test suite provides comprehensive coverage for the database client and page components in the application.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Files

### `src/lib/__tests__/db.test.ts`
Tests for the Prisma database client singleton pattern:
- Singleton pattern implementation
- Environment-based behavior (dev vs production)
- Global object management
- PrismaClient instantiation
- Edge cases and error handling

### `src/app/__tests__/page.test.tsx`
Tests for the home page component:
- Component rendering with various data states
- Async data fetching from Prisma
- JSON serialization of user data
- Layout and styling verification
- Edge cases (empty data, malformed data, special characters)
- Error handling for database failures

## Test Coverage Goals
- Line coverage: >90%
- Branch coverage: >85%
- Function coverage: >95%

## Testing Libraries
- Jest: Test framework
- React Testing Library: Component testing
- jest-mock-extended: Advanced mocking capabilities

## Best Practices
1. Each test is isolated and independent
2. Mocks are cleared between tests
3. Tests follow AAA pattern (Arrange, Act, Assert)
4. Descriptive test names explain what is being tested
5. Edge cases and error scenarios are thoroughly covered