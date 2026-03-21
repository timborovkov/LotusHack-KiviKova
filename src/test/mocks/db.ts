import { vi } from "vitest";

/**
 * Creates a chainable mock matching Drizzle's fluent API.
 * All methods return `this` by default (chainable).
 * Use `mockResolvedValueOnce` on the terminal method per test:
 *   - SELECT: terminal is `where()` or `orderBy()`
 *   - INSERT: terminal is `returning()`
 *   - UPDATE: terminal is `returning()` (where is chainable)
 *   - DELETE: terminal is `where()`
 */
export function createMockDb() {
  const mock: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = [
    "select",
    "from",
    "where",
    "orderBy",
    "insert",
    "values",
    "returning",
    "update",
    "set",
    "delete",
  ];

  for (const method of methods) {
    mock[method] = vi.fn().mockImplementation(() => mock);
  }

  return mock;
}
