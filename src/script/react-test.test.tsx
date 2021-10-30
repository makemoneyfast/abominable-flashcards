import { TestableComponent, TestableComponent2 } from "./react-testable";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

configure({ adapter: new Adapter() });
describe("Testable Component", () => {
  it("contains 'hello'", () => {
    const rendered = shallow(<TestableComponent />);
    expect(rendered.find(TestableComponent2).prop("width")).toBe(10);
    expect(rendered.find(TestableComponent2).prop("height")).toBe(20);
  });
});
