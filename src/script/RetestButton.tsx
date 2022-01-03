import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from "react-redux";

import { State } from "./common";

import { thunkToggleRetest } from "./redux/thunks";

interface RetestButtonProps {
  onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
  cardIsFlagged: boolean;
}

const mapStateToProps: (state: State) => RetestButtonProps = (state: State) => {
  if (state.quiz.currentCardIndex === null) {
    return {
      cardIsFlagged: false,
    } as RetestButtonProps;
  } else {
    const currentCardID = state.quiz.currentQuiz[state.quiz.currentCardIndex];
    const currentCard = state.assets.kanji[currentCardID];
    return {
      cardIsFlagged: currentCard.retest,
    } as RetestButtonProps;
  }
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => Partial<RetestButtonProps> = (dispatch: Dispatch<Action>) => {
  return {
    onClick: (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
      dispatch(thunkToggleRetest() as any); // Need to fix this!
    },
  };
};

const BaseRetestButton: React.FunctionComponent<RetestButtonProps> = (
  props
) => {
  const buttonCaption = props.cardIsFlagged ? "できた" : "失敗";
  return (
    <div className="retestButtonContainer">
      <input
        type="button"
        onClick={props.onClick}
        value={buttonCaption}
        className="retestButton japanese"
      />
    </div>
  );
};

const RetestButton = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseRetestButton);

export default RetestButton;
