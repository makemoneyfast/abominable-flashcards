import React from "react";

export const TestableComponent = () => {
  return (
    <div>
      <div>
        <div>
          <div>
            <TestableComponent2 width={10} height={20}>
              <strong>"Yes!</strong>
            </TestableComponent2>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestableComponent2 = (props: {
  width: number;
  height: number;
  children: string | JSX.Element;
}) => {
  return (
    <div>
      <div>
        <div>
          <div>
            <h1>
              width: {props.width} and height {props.height}
            </h1>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
