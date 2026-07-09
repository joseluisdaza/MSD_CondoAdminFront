# Unit Tests Guide

This directory contains unit tests for the CondoFE frontend application using **Vitest** and **React Testing Library**.

## Setup

The test suite is already configured with:

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- LoginPage.test.tsx
```

## Test Files Structure

### `App.test.tsx`

Tests for the main App component:

- Token loading from localStorage
- Authentication state management
- Loading states
- Login/logout flow

### `LoginPage.test.tsx`

Tests for the LoginPage component:

- Form rendering
- User input handling
- API calls
- Error handling
- Loading states
- Language switching

### `useUserRole.test.ts`

Tests for the useUserRole hook:

- Role fetching
- Role checking (`hasRole`, `hasAnyRole`)
- Error handling
- Loading states
- Token changes

### `protectedRoute.test.tsx`

Tests for the ProtectedRoute utility:

- Component rendering with authentication
- Redirect on unauthenticated state
- Props passing

### `InicioContent.test.tsx`

Example test for content components:

- Component rendering
- Data fetching
- Error handling
- Loading states

## Writing New Tests

### Basic Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useCustomHook } from "../hooks/useCustomHook";

describe("useCustomHook", () => {
  it("should return correct value", async () => {
    const { result } = renderHook(() => useCustomHook());

    await waitFor(() => {
      expect(result.current.value).toBe("expected");
    });
  });
});
```

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  });

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Testing User Events

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);

  const input = screen.getByRole('textbox');
  await user.type(input, 'typed text');
  await user.click(screen.getByRole('button'));

  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

## Best Practices

1. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
2. **Test behavior, not implementation**: Focus on what users see and do
3. **Mock external APIs**: Use `vi.fn()` for fetch and other external calls
4. **Clean up**: Tests automatically cleanup with the setup file
5. **Wait for async**: Use `waitFor` for async operations
6. **Group related tests**: Use `describe` blocks logically
7. **Clear mocks**: Call `vi.clearAllMocks()` in `beforeEach`

## Common Testing Patterns

### Testing Error States

```typescript
it('should display error message', async () => {
  (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));
  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
it('should show content when authenticated', () => {
  render(<MyComponent isAuthenticated={true} />);
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});

it('should hide content when not authenticated', () => {
  render(<MyComponent isAuthenticated={false} />);
  expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
});
```

### Testing API Integration

```typescript
it('should call API with correct params', async () => {
  global.fetch = vi.fn();
  render(<MyComponent />);

  await user.click(screen.getByRole('button'));

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/endpoint',
    expect.objectContaining({
      method: 'POST',
      headers: expect.any(Object),
    })
  );
});
```

## Coverage Goals

Aim for:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Run coverage report:

```bash
npm test -- --coverage
```

## Troubleshooting

### "Element not found" error

- Use `screen.debug()` to see the rendered output
- Check if element is rendered conditionally (use `waitFor`)
- Verify correct query (use `getByRole` for accessibility)

### "Cannot find module" error

- Check imports are correct
- Ensure files exist in the specified paths
- Check tsconfig.json aliases

### Mock not working

- Clear mocks in `beforeEach`
- Import `vi` from 'vitest'
- Verify mock implementation matches actual behavior

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
