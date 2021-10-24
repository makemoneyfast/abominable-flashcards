import { FunctionToTest } from "./example";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("React/Typescript example function", () => {
  it("returns the expected value", () => {
    const rendered = shallow(<FunctionToTest />);
    expect(rendered.find("h1")).toHaveLength(1);
  });
});
