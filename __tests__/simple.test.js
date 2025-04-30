/**
 * A simple test file to verify Jest is working properly
 */

describe("Basic test environment", () => {
  test("true should be true", () => {
    expect(true).toBe(true);
  });

  test("math should work", () => {
    expect(1 + 1).toBe(2);
  });

  test("string concatenation should work", () => {
    expect("hello " + "world").toBe("hello world");
  });
});
