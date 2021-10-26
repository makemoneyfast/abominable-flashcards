import { render } from "react-dom";

const main = () => {
  const now = new Date();
  return <h5>The time is now {now.toLocaleTimeString()}</h5>;
};

const targetNode = document.querySelector("#injectionNode");
render(main(), targetNode);
