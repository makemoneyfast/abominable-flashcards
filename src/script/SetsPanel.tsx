import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import _ from "Lodash";

import { changeAppState } from "./redux/appDuck";
import { thunkStartSetQuiz } from "./redux/thunks";

import { State, SetAsset, eCardState } from "./common";

import "./styles/setsPanel.less";

interface SetsPanelProps {
  currentSet: string;
  sets: SetAsset[];

  onStartSetQuiz: (setID: string) => void;
}

const BasicSetsPanel: React.FunctionComponent<SetsPanelProps> = (
  props: SetsPanelProps
) => {
  const quizSelectButtons = [];
  for (let set of props.sets) {
    if (set.kanji.length > 0) {
      if (set.id === props.currentSet) {
        quizSelectButtons.push(
          <div className="set selected" key={set.id}>
            {set.name} <strong>{set.kanji.length}</strong>
          </div>
        );
      } else {
        quizSelectButtons.push(
          <div
            className="set"
            key={set.id}
            onClick={() => {
              props.onStartSetQuiz(set.id);
            }}
          >
            {set.name} <strong>{set.kanji.length}</strong>
          </div>
        );
      }
    } else {
      quizSelectButtons.push(
        <div className="set empty" key={set.id}>
          {set.name}
        </div>
      );
    }
  }

  return (
    <div className="setsPanel">
      <div className="sets">{quizSelectButtons}</div>
    </div>
  );
};

const mapStateToProps: (state: State) => SetsPanelProps = (state: State) => {
  const setAssets = state.assets.allSets.map(
    (index) => state.assets.sets[index]
  );
  return {
    sets: setAssets,
    currentSet: state.quiz.currentSetID,
  } as SetsPanelProps;
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => Partial<SetsPanelProps> = (dispatch: Dispatch<Action>) => {
  return {
    onStartSetQuiz: (setID: string) => {
      dispatch(thunkStartSetQuiz(setID) as any); // :(
    },
  };
};

const SetsPanel = connect(mapStateToProps, mapDispatchToProps)(BasicSetsPanel);

export default SetsPanel;
