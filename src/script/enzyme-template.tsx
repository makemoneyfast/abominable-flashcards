import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import React from "react";

configure({ adapter: new Adapter() });

describe("Code under test", () => {
  it("fulfils requirement", () => {
    // const wrapper = shallow(<CodeUnderTest />);
    // expect(wrapper.find(ChildElement).length).toBe(1);
    // const childReference = wrapper.find(ChildElement);
    // const childProps = childReference.props();
  });
});
