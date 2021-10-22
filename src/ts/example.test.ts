import { functionToTest } from "./example";

describe("sample", () => {
  it("Returns the expected value", () => {
    expect(functionToTest()).toBe(42);
  });
});
