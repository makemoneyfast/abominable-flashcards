import { render } from "react-dom";
import { TestableComponentThree } from "./react-testable";

const main = () => {
  const now = new Date();
  return (
    <div>
      <TestableComponentThree
        clickCallback={(count: number) => console.error(count)}
      >
        Click me you asshole
      </TestableComponentThree>
      <h5>The time is now {now.toLocaleTimeString()}</h5>;
    </div>
  );
};

const targetNode = document.querySelector("#injectionNode");
render(main(), targetNode);
