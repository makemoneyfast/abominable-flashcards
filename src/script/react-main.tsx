import { render } from "react-dom";

const main = () => {
  const now = new Date();
  return (
    <div>
      <h5>The time is now {now.toLocaleTimeString()}</h5>
    </div>
  );
};

const targetNode = document.querySelector("#injectionNode");
render(main(), targetNode);
