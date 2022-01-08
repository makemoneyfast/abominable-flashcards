import * as React from "react";

import _ from "Lodash";

import "./styles/accentControl.less";

interface AccentControlProps {
  text: string;
  accentIndex: number;

  onAccentIndexChange: (accentIndex: number) => void;
}

class AccentControl extends React.Component<AccentControlProps> {
  constructor(props: AccentControlProps) {
    super(props);
  }

  render() {
    const stringCharacters: string[] = Array.from(this.props.text);

    const bits: JSX.Element[] = stringCharacters.map((character, index) => {
      if (index === this.props.accentIndex) {
        return (
          <span
            className="mora accented"
            onClick={() => this.props.onAccentIndexChange(-1)}
          >
            {character}
          </span>
        );
      } else {
        return (
          <span
            className="mora"
            onClick={() => this.props.onAccentIndexChange(index)}
          >
            {character}
          </span>
        );
      }
    });
    return <div className="accentControl">{bits}</div>;
  }
}
export default AccentControl;
