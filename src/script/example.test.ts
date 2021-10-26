import { functionToTest } from "./typescript-example";

describe("sample", () => {
  it("Returns the expected value", () => {
    expect(functionToTest()).toBe(42);
  });
});
