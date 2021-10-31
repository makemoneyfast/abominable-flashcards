import React from "react";
import { useState } from "react";

export const TestableComponent = () => {
  return (
    <div>
      <TestableComponent2 width={10} height={20}>
        <strong>"Yes!</strong>
      </TestableComponent2>
    </div>
  );
};

export const TestableComponent2 = (props: {
  width: number;
  height: number;
  children: string | JSX.Element;
}) => {
  return (
    <h1>
      width: {props.width} and height {props.height}
      <strong>{props.children}</strong>
    </h1>
  );
};

export const TestableComponentThree = (props: {
  clickCallback: (currentCount: number) => void;
  children: (JSX.Element | string) | (JSX.Element | string)[];
}) => {
  const [count, setCount] = useState(1);
  return (
    <h1
      onClick={() => {
        props.clickCallback(count), setCount(count + 1);
      }}
    >
      {props.children}
    </h1>
  );
};
