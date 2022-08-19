import { Action, UnhandledAction } from "./Action";
import {
  QuizState,
  eQuizMode,
  eCardState,
  EmptyQuizState,
  PopulatedQuizState,
} from "../common";
import { createShuffledArray } from "./utility";
import { DeleteCardAction, DELETE_CARD } from "./assetsDuck";
import _ from "Lodash";

// Actions
const START_SET_QUIZ = "MorningThunder/quiz/START_SET_QUIZ";
const START_TAG_QUIZ = "MorningThunder/quiz/START_TAG_QUIZ";
const FLIP = "MorningThunder/quiz/FLIP";
const CHANGE_QUIZ_MODE = "MorningThunder/quiz/CHANGE_QUIZ_MODE";
const START_RETEST = "MorningThunder/quiz/START_RETEST";
const CLEAR_QUIZ = "MorningThunder/quiz/CLEAR_QUIZ";

export type QuizAction =
  | UnhandledAction
  | SelectQuizModeAction
  | FlipAction
  | StartSetQuizAction
  | StartTagQuizAction
  | StartRetestAction
  | DeleteCardAction
  | ClearQuizAction;

const initialState: EmptyQuizState = {
  currentQuiz: null,
  quizMode: eQuizMode.character,
  cardState: null,
  currentSetID: null,
  currentTagID: null,
  currentCardIndex: null,
  retesting: null,
};
// Reducer
/**
 * @param {QuizState} state
 * @param {QuizAction} action
 * @return {QuizState}
 */
export default function reducer(
  state: QuizState,
  action: QuizAction
): QuizState {
  const cardFlipStateMap = [
    eCardState.hint,
    eCardState.answer,
    eCardState.question,
  ];

  if (state === undefined) {
    return Object.assign({}, initialState);
  }

  switch (action.type) {
    case START_SET_QUIZ:
      return {
        ...state,
        currentCardIndex: 0,
        cardState: eCardState.question,
        currentSetID: action.payload.setID,
        currentTagID: null,
        currentQuiz: action.payload.shuffledCardIDs,
        retesting: false,
      } as PopulatedQuizState;
    case START_TAG_QUIZ:
      // Todo: turn this into a function.
      return {
        ...state,
        currentCardIndex: 0,
        cardState: eCardState.question,
        currentSetID: null,
        currentTagID: action.payload.tag,
        currentQuiz: action.payload.shuffledCardIDs,
        retesting: false,
      } as PopulatedQuizState;
    case FLIP:
      if (state.currentCardIndex === null || state.cardState === null) {
        return {
          ...state,
        };
      } else {
        const nextCardState = cardFlipStateMap[state.cardState];
        let newCardIndex = state.currentCardIndex;
        if (nextCardState === eCardState.question) {
          newCardIndex++;
        }
        return {
          ...state,
          currentCardIndex: newCardIndex,
          cardState: nextCardState,
        };
      }
    case CHANGE_QUIZ_MODE:
      return {
        ...state,
        quizMode: action.payload.mode,
      };
    case START_RETEST:
      return {
        ...state,
        currentQuiz: action.payload.shuffledKanji,
        cardState: eCardState.question,
        currentCardIndex: 0,
        retesting: true,
      } as PopulatedQuizState;
    case DELETE_CARD:
      if (state.currentSetID !== null || state.currentTagID !== null) {
        console.log("oh shit");
      }
      return state;
    case CLEAR_QUIZ:
      return { ...initialState } as EmptyQuizState;
    default:
      return state;
  }
}

// Action Creators

type StartSetQuizAction = Action<
  "MorningThunder/quiz/START_SET_QUIZ",
  { setID: string; shuffledCardIDs: string[] }
>;
/**
 *
 * @param {string} setID
 * @param {string[]} shuffledCardIDs
 * @return {StartSetQuizAction}
 */
export function setQuizSelected(
  setID: string,
  shuffledCardIDs: string[]
): StartSetQuizAction {
  return {
    type: START_SET_QUIZ,
    payload: {
      setID,
      shuffledCardIDs,
    },
  };
}

type StartTagQuizAction = Action<
  "MorningThunder/quiz/START_TAG_QUIZ",
  { tag: string; shuffledCardIDs: string[] }
>;

/**
 *
 * @param {string} tag
 * @param {string[]} shuffledCardIDs
 * @return {StartQuizTagAction}
 */
export function tagQuizSelected(
  tag: string,
  shuffledCardIDs: string[]
): StartTagQuizAction {
  return {
    type: START_TAG_QUIZ,
    payload: {
      tag,
      shuffledCardIDs,
    },
  };
}

type SelectQuizModeAction = Action<
  "MorningThunder/quiz/CHANGE_QUIZ_MODE",
  { mode: eQuizMode }
>;

/**
 *
 * @param {eQuizMode} mode
 * @return {SelectQuizModeAction}
 */
export function quizModeChanged(mode: eQuizMode): SelectQuizModeAction {
  return { type: CHANGE_QUIZ_MODE, payload: { mode } };
}

type FlipAction = Action<"MorningThunder/quiz/FLIP", null>;

/**
 *
 * @return {FlipCardAction}
 */
export function flipCard(): FlipAction {
  return { type: FLIP, payload: null };
}

type StartRetestAction = Action<
  "MorningThunder/quiz/START_RETEST",
  { shuffledKanji: string[] }
>;

/**
 *
 * @param {string[]} IDsOfKanjiToRetest
 * @return {StartRetestAction}
 */
export function startRetest(IDsOfKanjiToRetest: string[]): StartRetestAction {
  const shuffledKanji = createShuffledArray(IDsOfKanjiToRetest);
  return {
    type: START_RETEST,
    payload: { shuffledKanji },
  };
}

type ClearQuizAction = Action<"MorningThunder/quiz/CLEAR_QUIZ", undefined>;

/**
 *
 * @return {ClearQuizAction}
 */
export function clearQuiz(): ClearQuizAction {
  return {
    type: CLEAR_QUIZ,
    payload: undefined,
  };
}
