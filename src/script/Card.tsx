import * as React from "react";
import * as ReactDom from "react-dom";

import { connect } from "react-redux";
import { Dispatch, Action } from "redux";

import { State, eCardState, eQuizMode, KanjiAsset } from "./common";

import { flipCard } from "./redux/quizDuck";
import RetestButton from "./RetestButton";

import { computeFontSize } from "./utils";

import _ from "Lodash";

import "./styles/card.less";

import soundURL from "url:./sound.mp3";

// const soundURL = "lol";

console.log("LOL", soundURL);

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
  onyomi: string;

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
          onyomi: currentCard.onyomi,

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
  let answer: string;
  let questionLanguage: string;
  let vocabularyType: " character" | " compound";
  let answerLanguage: string;
  let mapToKatakana = (hiragana: string) => {
    return hiragana
      .split("")
      .map(
        (character) =>
          ({
            あ: "ア",
            い: "イ",
            う: "ウ",
            え: "エ",
            お: "オ",
            は: "ハ",
            ひ: "ヒ",
            ふ: "フ",
            へ: "ヘ",
            ほ: "ホ",
            か: "カ",
            き: "キ",
            く: "ク",
            け: "ケ",
            こ: "コ",
            さ: "サ",
            し: "シ",
            す: "ス",
            せ: "セ",
            そ: "ソ",
            た: "タ",
            ち: "チ",
            つ: "ツ",
            て: "テ",
            と: "ト",
            ら: "ラ",
            り: "リ",
            る: "ル",
            れ: "レ",
            ろ: "ロ",
            ま: "マ",
            み: "ミ",
            む: "ム",
            め: "メ",
            も: "モ",
            な: "ナ",
            に: "ニ",
            ぬ: "ヌ",
            ね: "ネ",
            の: "ノ",
            や: "ヤ",
            ゆ: "ユ",
            よ: "ヨ",
            わ: "ワ",
            を: "ヲ",
            ん: "ン",
            が: "ガ",
            ぎ: "ギ",
            ぐ: "グ",
            げ: "ゲ",
            ご: "ゴ",
            だ: "ダ",
            ぢ: "ヂ",
            づ: "ヅ",
            で: "デ",
            ど: "ド",
            ざ: "ザ",
            じ: "ジ",
            ず: "ズ",
            ぜ: "ゼ",
            ぞ: "ゾ",
            ば: "バ",
            び: "ビ",
            ぶ: "ブ",
            べ: "ベ",
            ぼ: "ボ",
            ぱ: "パ",
            ぴ: "ピ",
            ぷ: "プ",
            ぺ: "ペ",
            ぽ: "ポ",
            ゃ: "ャ",
            ゅ: "ュ",
            ょ: "ョ",
            っ: "ッ",
            " ": " ",
            "　": "　",
          }[character])
      )
      .join("");
  };

  switch (props.quizType) {
    case eQuizMode.character:
      question = [props.character];
      hint = [props.hint];
      answer = props.meaning;
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " english";
      break;
    case eQuizMode.meaning:
      question = [props.kunyomi, <br></br>, mapToKatakana(props.onyomi)];
      hint = [
        props.meaning,
        <br></br>,
        <span className="subsidiary">{props.hint}</span>,
      ];
      answer = props.character;
      questionLanguage = " japanese";
      vocabularyType = " compound";
      answerLanguage = " japanese";
      break;
    case eQuizMode.kunyomi:
      question = [props.character];
      hint = [props.meaning];
      answer = props.kunyomi;
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " japanese";
      break;
    case eQuizMode.onyomi:
      question = [props.character];
      hint = [props.meaning];
      answer = props.onyomi;
      questionLanguage = " japanese";
      vocabularyType =
        props.character.length === 1 ? " character" : " compound";
      answerLanguage = " japanese";
      break;
  }

  // Handle missing fields

  hint = hint.map((item) => (item ? item : "✕"));
  answer = answer || "✕";

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

  const style = { fontSize: `${computeFontSize(question[0])}vw` };

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
            style={style}
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
            style={style}
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

      const audio = new Audio(soundURL);
      const playAudio = (event: any) => {
        console.log(event);
        event.stopPropagation();
        audio.play();
        return false;
      };
      return (
        <div
          className={
            props.retest ? "card answer-mode retest" : "card answer-mode"
          }
          onClick={flipHandler}
        >
          <div className="status japanese">{statusMessage}</div>
          <div
            className={"question" + questionLanguage + vocabularyType}
            style={style}
            onClick={playAudio}
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
