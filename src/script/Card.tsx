import * as React from "react";
import * as ReactDom from "react-dom";

import { connect } from "react-redux";
import { Dispatch, Action } from "redux";

import { State, eCardState, eQuizMode, KanjiAsset } from "./common";

import { flipCard } from "./redux/quizDuck";
import RetestButton from "./RetestButton";

import { computeFontSize, mapToKatakana } from "./utils";

import _ from "Lodash";

import "./styles/card.less";

interface CardPropsFromState {
  currentSetName: string | undefined;
  currentTagName: string | undefined;
  cardNumber: number;
  totalCards: number;
  numberOfCardsToRetest: number;
  retesting: boolean;

  character: string;
  tags: string[];
  hint: string;
  meaning: string;
  kunyomi: string;
  kunyomiAccent: number;
  onyomi: string;
  onyomiAccent: number;
  audio: string;

  retest: boolean;
  cardState: eCardState;
  quizType: eQuizMode;
  canFlip: boolean;
}

interface CardPropsFromDispatch {
  onFlip: () => void;
}

const mapStateToProps: (state: State) => CardPropsFromState = (
  state: State
) => {
  if (state.quiz.currentQuiz === null) {
    throw new Error("Can't render a card while there's no quiz set up");
  }
  const currentSet =
    state.quiz.currentSetID !== null
      ? state.assets.sets[state.quiz.currentSetID]
      : undefined;
  const currentTag =
    state.quiz.currentTagID !== null
      ? state.assets.tags[state.quiz.currentTagID]
      : undefined;
  let currentCard: KanjiAsset | undefined;
  let canFlip: boolean;
  if (state.quiz.currentCardIndex !== null) {
    canFlip = !(
      state.quiz.cardState === eCardState.answer &&
      state.quiz.currentCardIndex >= state.quiz.currentQuiz.length - 1
    );
    currentCard =
      state.assets.kanji[state.quiz.currentQuiz[state.quiz.currentCardIndex]];
  } else {
    canFlip = false;
    currentCard = undefined;
  }
  return {
    currentSetName: currentSet ? currentSet.name : undefined,
    currentTagName: currentTag ? currentTag.id : undefined,
    cardNumber:
      state.quiz.currentCardIndex !== null
        ? state.quiz.currentCardIndex + 1
        : 0,
    totalCards: state.quiz.currentQuiz.length,
    numberOfCardsToRetest: _(state.assets.kanji)
      .filter((kanji) => kanji.retest)
      .value().length,
    retesting: state.quiz.retesting,
    ...(currentCard
      ? {
          character: currentCard.character,
          tags: currentCard.tags,
          hint: currentCard.notes,
          meaning: currentCard.meaning,
          kunyomi: currentCard.kunyomi,
          kunyomiAccent: currentCard.kunyomiAccent,
          onyomi: currentCard.onyomi,
          onyomiAccent: currentCard.onyomiAccent,
          audio: currentCard.audio,

          retest: currentCard.retest,
          cardState: state.quiz.cardState,
        }
      : {
          character: "",
          tags: [],
          hint: [],
          meaning: "",
          kunyomi: "",
          onyomi: "",
          audio: "",

          retest: false,
          cardState: state.quiz.cardState,
        }),
    quizType: state.quiz.quizMode,
    canFlip,
  } as CardPropsFromState;
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => CardPropsFromDispatch = (dispatch: Dispatch<Action>) => {
  return {
    onFlip: () => dispatch(flipCard()),
  };
};

const BasicCard: React.FunctionComponent<
  CardPropsFromState & CardPropsFromDispatch
> = (props: CardPropsFromState & CardPropsFromDispatch) => {
  let question: any[];
  let hint: any[];
  let answer: any[];
  let questionLanguage: string;
  let vocabularyType: " character" | " compound";
  let answerLanguage: string;
  let questionFontSize: string;

  const formatWithAccent = (text: string, accentIndex: number) => {
    if (
      accentIndex == undefined ||
      accentIndex < 0 ||
      accentIndex >= text.length
    ) {
      return [text];
    } else {
      const returnValue = [];
      if (accentIndex > 0) {
        returnValue.push(text.slice(0, accentIndex));
      }
      returnValue.push(
        <span className="accent">
          {text.slice(accentIndex, accentIndex + 1)}
        </span>
      );
      if (accentIndex < text.length - 1) {
        returnValue.push(text.slice(accentIndex + 1));
      }
      return returnValue;
    }
  };

  const formattedKunyomi = formatWithAccent(props.kunyomi, props.kunyomiAccent);
  const formattedOnyomi = formatWithAccent(
    mapToKatakana(props.onyomi),
    props.onyomiAccent
  );

  switch (props.quizType) {
    case eQuizMode.meaning:
      question = [props.character];
      hint = [props.hint];
      answer = [props.meaning];
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " english";
      break;
    case eQuizMode.character:
      // Need to apply the formatting here!!!
      question = [...formattedKunyomi, <br></br>, ...formattedOnyomi];
      hint = [
        props.meaning,
        <br></br>,
        <span className="subsidiary">{props.hint}</span>,
      ];
      answer = [props.character];
      questionLanguage = " japanese";
      vocabularyType = " compound";
      answerLanguage = " japanese";
      break;
    case eQuizMode.kunyomi:
      question = [props.character];
      hint = [props.meaning];
      answer = formattedKunyomi;
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " japanese";
      break;
    case eQuizMode.onyomi:
      question = [props.character];
      hint = [props.meaning];
      answer = formattedOnyomi;
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " japanese";
      break;
  }

  switch (props.quizType) {
    case eQuizMode.character:
      questionFontSize = `${computeFontSize(props.kunyomi, props.onyomi)}vw`;
      break;
    case eQuizMode.meaning:
    case eQuizMode.kunyomi:
    case eQuizMode.onyomi:
      questionFontSize = `${computeFontSize(props.character)}vw`;
      break;
  }

  const questionFontStyle: React.CSSProperties = {
    fontSize: questionFontSize,
    lineHeight: questionFontSize,
  };

  // Handle missing fields

  hint = hint.map((item) => (item ? item : "✕"));
  answer = answer || ["✕"];

  const flipHandler = props.canFlip ? props.onFlip : () => undefined;

  let statusMessage;

  if (props.currentSetName !== undefined) {
    if (props.numberOfCardsToRetest > 0) {
      statusMessage = (
        <div>
          <strong>{props.currentSetName}</strong>
          {props.retesting ? "再検査" : "検査"}
          {"　"}
          <strong>{props.totalCards}</strong>枚の第
          <strong>{props.cardNumber}</strong>
          {"　"}
          <strong>{props.numberOfCardsToRetest}</strong>失敗
        </div>
      );
    } else {
      statusMessage = (
        <div>
          <strong>{props.currentSetName}</strong>
          {props.retesting ? "再検査" : "検査"}
          {"　"}
          <strong>{props.totalCards}</strong>枚の第
          <strong>{props.cardNumber}</strong>
        </div>
      );
    }
  } else {
    if (props.numberOfCardsToRetest > 0) {
      statusMessage = (
        <div>
          <strong>&lt;{props.currentTagName}&gt;</strong>
          {props.retesting ? "再検査" : "検査"}
          {"　"}
          <strong>{props.totalCards}</strong>枚の第
          <strong>{props.cardNumber}</strong>
          {"　"}
          <strong>{props.numberOfCardsToRetest}</strong>失敗
        </div>
      );
    } else {
      statusMessage = (
        <div>
          <strong>&lt;{props.currentTagName}&gt;</strong>
          {props.retesting ? "再検査" : "検査"}
          {"　"}
          <strong>{props.totalCards}</strong>枚の第
          <strong>{props.cardNumber}</strong>
        </div>
      );
    }
  }

  switch (props.cardState) {
    case eCardState.question:
      return (
        <div
          className={
            props.retest ? "card question-mode retest" : "card question-mode"
          }
          onClick={flipHandler}
        >
          <div className="status japanese">{statusMessage}</div>
          <div
            className={"question" + questionLanguage + vocabularyType}
            style={questionFontStyle}
          >
            {question}
          </div>
          <RetestButton />
        </div>
      );
    case eCardState.hint:
      return (
        <div
          className={props.retest ? "card hint-mode retest" : "card hint-mode"}
          onClick={flipHandler}
        >
          <div className="status japanese">{statusMessage}</div>
          <div
            className={"question" + questionLanguage + vocabularyType}
            style={questionFontStyle}
          >
            {question}
          </div>
          <div className="answer">
            <div className="hint">
              <div className="content english">{hint}</div>
            </div>
          </div>
          <RetestButton />
        </div>
      );
    case eCardState.answer:
      const tags = [];
      for (let tag of props.tags) {
        tags.push(
          <div className="tag" key={tag} id={tag}>
            {tag}
          </div>
        );
      }

      const cardClasses = ["card", "answer-mode"];
      if (props.retest) {
        cardClasses.push("retest");
      }
      if (props.audio !== "" && props.audio !== undefined) {
        cardClasses.push("audio");
      }

      const playAudio = (event: any) => {
        event.stopPropagation();
        const assetLocation = `${window.location}audio/${props.audio}.mp3`;
        const audio = new Audio(assetLocation);
        audio
          .play()
          .catch((e) =>
            console.log(
              `Failed to play audio at ${assetLocation} - asset probably missing or invalid.`
            )
          );
        return false;
      };

      return (
        <div className={cardClasses.join(" ")} onClick={flipHandler}>
          <div className="status japanese">{statusMessage}</div>
          {props.audio && <div className="audioIndicator">耳</div>}
          <div
            className={"question" + questionLanguage + vocabularyType}
            style={questionFontStyle}
            onClick={props.audio !== "" ? playAudio : () => undefined}
          >
            {question}
          </div>
          <div className="answer">
            <div className="meaning">
              <div className={"content" + answerLanguage}>{answer}</div>
            </div>
            <div className="hint">
              <div className="content english">{hint}</div>
            </div>
          </div>
          <div className="tags">{tags}</div>
          <RetestButton />
        </div>
      );
  }
  return <div />;
};

const Card = connect(mapStateToProps, mapDispatchToProps)(BasicCard);

export default Card;
