import { FunctionToTest } from "./example";

describe("React/Typescript example function", () => {
  it("returns the expected value", () => {
    expect(<FunctionToTest />).toBe(true);
  });
});
