import { TestableComponent2, TestableComponentThree } from "./react-testable";
import "@testing-library/jest-dom";
import { render, fireEvent, getByText } from "@testing-library/react";
import React from "react";

describe("Testable Component", () => {
  it("contains 'hello'", () => {
    const { container } = render(
      <TestableComponent2 width={100} height={200}>
        LOL
      </TestableComponent2>
    );

    expect(getByText(container, "LOL")).toBeDefined();
  });
});

describe("Testable component three", () => {
  it("renders text node child as descendent", () => {
    const descendent = "Mock descendent text node";
    const container = render(
      <TestableComponentThree clickCallback={() => undefined}>
        {descendent}
      </TestableComponentThree>
    );

    const descendentWrapper = getByText(container.container, descendent);
    expect(descendentWrapper).toBeDefined();
  });
  it("renders multiple children as descendents", () => {
    const descendents = [
      <strong key={1}>Strong child element</strong>,
      <em key={2}>Emphasis child element</em>,
    ];
    const { container } = render(
      <TestableComponentThree clickCallback={() => undefined}>
        {descendents}
      </TestableComponentThree>
    );

    const strongDescendent = getByText(container, "Strong child element");
    const emphasisDescendent = getByText(container, "Emphasis child element");

    expect(strongDescendent).toBeDefined();
    expect(emphasisDescendent).toBeDefined();
  });

  it("calls the click callback on a click", () => {
    const stubCallback = jest.fn();

    const { container } = render(
      <TestableComponentThree clickCallback={stubCallback}>
        Click me
      </TestableComponentThree>
    );

    const clickTarget = getByText(container, "Click me");
    expect(clickTarget).toBeDefined();

    fireEvent.click(clickTarget);
    fireEvent.click(clickTarget);
    fireEvent.click(clickTarget);

    expect(stubCallback).toHaveBeenCalledTimes(3);
    expect(stubCallback.mock.calls[0]).toEqual([1]);
    expect(stubCallback.mock.calls[1]).toEqual([2]);
    expect(stubCallback.mock.calls[2]).toEqual([3]);
  });
  it("updates the click count passed to the callback on successive clicks", () => {});
});
