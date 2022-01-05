import * as React from "react";

import _ from "Lodash";

import "./styles/setChooser.less";

interface SetChooserProps {
  allSets: { name: string; id: string }[];
  selectedSets: string[];

  onSetChange: (sets: string[]) => void;
}

class SetChooser extends React.Component<SetChooserProps> {
  constructor(props: SetChooserProps) {
    super(props);
  }

  render() {
    const combinedSetControls = this.props.allSets.map((set) => {
      const selected = this.props.selectedSets.includes(set.id);
      const classNames = ["setItem", "clickable"];
      if (selected) {
        classNames.push("selected");
      }
      return (
        <div
          key={set.id}
          className={classNames.join(" ")}
          onClick={() => {
            const updatedSelectedItems = selected
              ? this.props.selectedSets.filter(
                  (selectedSetID) => selectedSetID !== set.id
                )
              : [...this.props.selectedSets, set.id];
            this.props.onSetChange(updatedSelectedItems);
          }}
        >
          {set.name}
        </div>
      );
    });

    return <div className="setChooser">{combinedSetControls}</div>;
  }
}
export default SetChooser;
