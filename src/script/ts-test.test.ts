import { testableFunction } from "./ts-testable";

describe("testable function", () => {
  it("returns 'result' as a string", () => {
    expect(testableFunction()).toBe("Result");
  });
});
