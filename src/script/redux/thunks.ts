import { State, Assets, KanjiAsset, TagAsset, AppMode } from "../common";
import {
  clearAllRetest,
  toggleRetest,
  deleteCard,
  deleteTag,
  deleteSet,
  AssetsAction,
} from "./assetsDuck";
import {
  DataSource,
  exportData,
  dataAvailable,
  dataBad,
  dataLoaded,
  LoaderAction,
} from "./loaderDuck";
import { changeAppState, AppAction } from "./appDuck";
import {
  setQuizSelected,
  tagQuizSelected,
  startRetest,
  clearQuiz,
  QuizAction,
} from "./quizDuck";
import {
  editNominatedCard,
  saveExistingCard,
  endCardEdit,
  flushBuffer,
  CardEditBuffer,
  editNewCard,
  saveNewCard,
  saveNewTag,
  CardEditorAction,
} from "./cardEditorDuck";
import {
  SetEditBuffer,
  saveNewSet,
  saveExistingSet,
  endSetEdit,
  SetEditorAction,
} from "./setEditorDuck";
import {
  applyChangesToFiltered,
  resetFilterParameters,
  CardManagerAction,
} from "./cardManagerDuck";
import {
  createShuffledArray,
  validateAssets,
  serialiseAssets,
  writeStringToFile,
  saveToLocalStorage,
  getFilteredCardsFromState,
} from "./utility";

import { Dispatch } from "react";

import _ from "Lodash";
import { editNewSet, editNominatedSet } from "./setEditorDuck";

type Thunk = (
  dispatch: Dispatch<SupportedAction>,
  getState: () => State
) => void;
type SupportedAction =
  | AppAction
  | AssetsAction
  | CardEditorAction
  | CardManagerAction
  | LoaderAction
  | QuizAction
  | SetEditorAction
  | Thunk;

export function thunkAttemptToLoadFromJSON(
  rawJSON: string | null,
  source: DataSource
) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    let output;
    let parsingFailed = false;

    if (rawJSON === null) {
      parsingFailed = true;
      dispatch(dataBad(source));
    } else {
      try {
        output = JSON.parse(rawJSON);
      } catch (e) {
        parsingFailed = true;
        dispatch(dataBad(source));
      }
    }

    if (!parsingFailed) {
      if (!validateAssets(output)) {
        dispatch(dataBad(source));
      } else {
        let unsavedChanges;
        if (source === "local") {
          unsavedChanges = output.unexportedChanges;
        } else {
          unsavedChanges = false;
        }
        let initialQuizID: string = output.allSets[0];
        output.assets.kanji = _(output.assets.kanji)
          .map((asset) =>
            _.assign(
              {
                onyomi: "",
                kunyomi: "",
                tags: [],
                retest: false,
                audio: "",
              },
              asset
            )
          )
          .keyBy((asset) => asset.character)
          .value();
        output.assets.tags = _(output.assets.tags)
          .map((asset) =>
            _.assign(
              {
                name: asset.id,
              },
              asset
            )
          )
          .keyBy((asset) => asset.id)
          .value();
        dispatch(
          dataAvailable(
            {
              kanji: output.assets.kanji,
              sets: output.assets.sets,
              tags: output.assets.tags,
              allSets: output.allSets,
            },
            source,
            unsavedChanges
          )
        );
        dispatch(dataLoaded(source));
        dispatch(thunkFlushToLocalStorage());
        dispatch(thunkStartSetQuiz(initialQuizID));
      }
    }
  };
}

export function thunkFlushToLocalStorage() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();

    // Write newly loaded state into local storage.
    let newDataSerialised = serialiseAssets(state.assets.allSets, {
      kanji: state.assets.kanji,
      sets: state.assets.sets,
      tags: state.assets.tags,
    });
    saveToLocalStorage(newDataSerialised);
    dispatch(flushBuffer());
  };
}

export function thunkToggleRetest() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    if (state.quiz.currentCardIndex !== null) {
      const currentCardID = state.quiz.currentQuiz[state.quiz.currentCardIndex];
      dispatch(toggleRetest(currentCardID));
    }
  };
}

export function thunkStartDefaultQuiz() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    if (!state.assets.allSets || state.assets.allSets.length === 0) {
      throw new Error("No sets so can't start default quiz :(");
    } else {
      const setID = state.assets.allSets[0];
      const shuffledCardIDs = createShuffledArray(
        state.assets.sets[setID].kanji
      );
      dispatch(clearAllRetest());
      dispatch(setQuizSelected(setID, shuffledCardIDs));
      dispatch(changeAppState("quiz"));
    }
  };
}

export function thunkStartSetQuiz(setID: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const shuffledCardIDs = createShuffledArray(state.assets.sets[setID].kanji);
    dispatch(clearAllRetest());
    dispatch(setQuizSelected(setID, shuffledCardIDs));
    dispatch(changeAppState("quiz"));
  };
}

export function thunkStartTagQuiz(tag: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const shuffledCardIDs = createShuffledArray(
      _(state.assets.kanji)
        .filter((kanji) => kanji.tags.indexOf(tag) > -1)
        .map((kanji) => kanji.character)
        .value()
    );
    dispatch(clearAllRetest());
    dispatch(tagQuizSelected(tag, shuffledCardIDs));
    dispatch(changeAppState("quiz"));
  };
}

export function thunkStartRetest() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    let IDsOfKanjiToRetest: string[] = _(getState().assets.kanji)
      .filter((kanji) => kanji.retest)
      .map((kanji) => kanji.character)
      .value();
    IDsOfKanjiToRetest = createShuffledArray(IDsOfKanjiToRetest);
    dispatch(clearAllRetest());
    dispatch(startRetest(IDsOfKanjiToRetest));
  };
}

export function thunkEditNewSet(modeOnExit: AppMode) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(editNewSet());
    dispatch(changeAppState("set_editor", modeOnExit));
  };
}

export function thunkEditNominatedSet(id: string, modeOnExit: AppMode) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const set = state.assets.sets[id];
    if (set !== undefined) {
      dispatch(
        editNominatedSet({
          id: set.id,
          name: set.name,
          kanji: set.kanji,
        })
      );
      dispatch(changeAppState("set_editor", modeOnExit));
    }
  };
}

export function thunkEditNewCard(modeOnExit: AppMode) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(editNewCard());
    dispatch(changeAppState("card_editor", modeOnExit));
  };
}

export function thunkEditNominatedCard(id: string, modeOnExit: AppMode) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const kanji = state.assets.kanji[id];
    if (kanji !== undefined) {
      dispatch(
        editNominatedCard(kanji.character, {
          kanji: kanji.character,
          hint: kanji.notes,
          meaning: kanji.meaning,
          kunyomi: kanji.kunyomi,
          onyomi: kanji.onyomi,
          audio: kanji.audio,
          tags: kanji.tags ? kanji.tags : [],
          sets: [],
        })
      );
      dispatch(changeAppState("card_editor", modeOnExit));
    }
  };
}

export function thunkEditCurrentCard(modeOnExit: AppMode) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    if (state.quiz.currentQuiz !== null) {
      if (state.quiz.currentQuiz.length > 0) {
        const kanjiID = state.quiz.currentQuiz[state.quiz.currentCardIndex];
        dispatch(thunkEditNominatedCard(kanjiID, modeOnExit));
      }
    }
  };
}

export function thunkSaveNewTagAndFlush(tagName: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(saveNewTag(tagName));
    dispatch(thunkFlushToLocalStorage() as any);
  };
}

export function thunkSaveSetBufferContentsAndExit() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    if (state.setEditor.newSet !== null) {
      if (state.setEditor.newSet) {
        dispatch(
          saveNewSet(state.setEditor.name, state.setEditor.kanji.slice())
        );
      } else {
        if (state.setEditor.id === null) {
          throw new Error(
            "If newSet is false then there really is supposed to be a set ID"
          );
        }
        dispatch(
          saveExistingSet(
            state.setEditor.id,
            state.setEditor.name,
            state.setEditor.kanji.slice()
          )
        );
      }
      dispatch(thunkFlushToLocalStorage());
      dispatch(endSetEdit());
      dispatch(
        changeAppState(
          state.setEditor.modeOnExit !== null
            ? state.setEditor.modeOnExit
            : "card_manager"
        )
      );
    }
  };
}

export function thunkSaveCardBufferContentsAndExit() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    if (state.cardEditor.newCard) {
      dispatch(
        saveNewCard({
          kanji: state.cardEditor.kanji,
          hint: state.cardEditor.hint,
          meaning: state.cardEditor.meaning,
          kunyomi: state.cardEditor.kunyomi,
          onyomi: state.cardEditor.onyomi,
          audio: state.cardEditor.audio,
          tags: state.cardEditor.tags,
          sets: state.cardEditor.sets,
        })
      );
    } else {
      if (state.cardEditor.kanji === null) {
        throw new Error(
          "If we're saving a card that's not marked new then the buffer should not be empty."
        );
      } else {
        dispatch(
          saveExistingCard(state.cardEditor.kanji, {
            kanji: state.cardEditor.kanji,
            hint: state.cardEditor.hint,
            meaning: state.cardEditor.meaning,
            kunyomi: state.cardEditor.kunyomi,
            onyomi: state.cardEditor.onyomi,
            audio: state.cardEditor.audio,
            tags: state.cardEditor.tags,
            sets: state.cardEditor.sets,
          })
        );
      }
    }
    dispatch(thunkFlushToLocalStorage());
    dispatch(endCardEdit());
    dispatch(
      changeAppState(
        state.cardEditor.modeOnExit !== null
          ? state.cardEditor.modeOnExit
          : "card_manager"
      )
    );
  };
}

export function thunkEndCardEdit() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const newMode = state.cardEditor.modeOnExit;
    dispatch(endCardEdit);
    dispatch(changeAppState(newMode));
  };
}

export function thunkEndSetEdit() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    const newMode = state.setEditor.modeOnExit;
    dispatch(endCardEdit);
    dispatch(changeAppState(newMode));
  };
}

export function thunkDeleteSetAndFlush(setID: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(deleteSet(setID));
    dispatch(thunkFlushToLocalStorage() as any);
  };
}

export function thunkDeleteCardAndFlush(cardID: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(deleteCard(cardID));
    dispatch(thunkFlushToLocalStorage() as any);
  };
}

export function thunkDeleteTagAndFlush(tagID: string) {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(deleteTag(tagID));
    dispatch(thunkFlushToLocalStorage() as any);
  };
}

export function thunkApplyChangesToFilteredAndFlush() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();

    // Apply changes
    dispatch(
      applyChangesToFiltered(
        getFilteredCardsFromState(state),
        state.cardManager.setsSelectedForModification,
        state.cardManager.setModificationOperation,
        state.cardManager.tagsSelectedForModification,
        state.cardManager.tagModificationOperation
      )
    );

    // Flush
    dispatch(thunkFlushToLocalStorage() as any);

    // Clear editor state. Maybe? Yes.
    dispatch(resetFilterParameters());
  };
}

export function thunkSwitchToEditMode() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    dispatch(clearQuiz());
    dispatch(changeAppState("card_manager"));
  };
}

export function thunkHandleExport() {
  return (dispatch: Dispatch<SupportedAction>, getState: () => State) => {
    const state = getState();
    // This is the point.
    const output: string = serialiseAssets(state.assets.allSets, {
      kanji: state.assets.kanji,
      sets: state.assets.sets,
      tags: state.assets.tags,
    });

    console.log(output);
    writeStringToFile(output, "Quiz.json");
    dispatch(exportData());
  };
}
