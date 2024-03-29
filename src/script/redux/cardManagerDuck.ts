import { Action, UnhandledAction } from "./Action";
import { CardManagerState } from "../common";
import { DeleteCardAction, DELETE_CARD } from "./assetsDuck";
import _ from "Lodash";

// Actions
export const TOGGLE_CARD_SELECTION =
  "MorningThunder/cardManager/TOGGLE_CARD_SELECTION";
const TOGGLE_FILTER_SELECTED =
  "MorningThunder/cardManager/TOGGLE_FILTER_SELECTED";
const TOGGLE_MATCH_FIELD = "MorningThunder/cardManager/TOGGLE_MATCH_FIELD";
const CHANGE_FILTER_TEXT_TO_MATCH =
  "MorningThunder/cardManager/CHANGE_FILTER_TEXT_TO_MATCH";
const CHANGE_TAG_SEARCH_TEXT =
  "MorningThunder/cardManager/CHANGE_TAG_SEARCH_TEXT";
const CHANGE_TAGS_TO_MATCH = "MorningThunder/cardManager/CHANGE_TAGS_TO_MATCH";
const CHANGE_SETS_TO_MATCH = "MorningThunder/cardManager/CHANGE_SETS_TO_MATCH";
const CHANGE_SETS_TO_MODIFY_ON_SELECTED =
  "MorningThunder/cardManager/CHANGE_SETS_TO_MODIFY_ON_SELECTED";
const CHANGE_SET_OPERATION = "MorningThunder/cardManager/CHANGE_SET_OPERATION";
const CHANGE_TAGS_TO_MODIFY_ON_SELECTED_SEARCH_TEXT =
  "MorningThunder/cardManager/CHANGE_TAGS_TO_MODIFY_ON_SELECTED_SEARCH_TEXT";
const CHANGE_TAGS_TO_MODIFY_ON_SELECTED =
  "MorningThunder/cardManager/CHANGE_TAGS_TO_MODIFY_ON_SELECTED";
const CHANGE_TAG_OPERATION = "MorningThunder/cardManager/CHANGE_TAG_OPERATION";
export const APPLY_CHANGES_TO_FILTERED =
  "MorningThunder/cardManager/APPLY_CHANGES_TO_FILTERED";
const RESET_FILTER_PARAMETERS =
  "MorningThunder/cardManager/RESET_FILTER_PARAMETERS";

export type CardManagerAction =
  | UnhandledAction
  | ToggleCardSelectAction
  | ToggleFilterSelectedAction
  | ChangeFilterTextToMatchAction
  | ToggleMatchFieldAction
  | ChangeTagSearchTextAction
  | ChangeTagsToMatchAction
  | ChangeSetsToMatchAction
  | ChangeTagsToModifyOnSelectedSearchTextAction
  | ChangeTagsToModifyOnSelectedAction
  | ChangeTagOperationAction
  | ChangeSetsToModifyOnSelectedAction
  | ChangeSetOperationAction
  | DeleteCardAction
  | ResetFilterParametersAction;

const initialState: CardManagerState = {
  // Have to render Loader to begin with because rendering it
  // kicks off the load from local storage.
  selectedCards: [],

  matchSelectedForInclude: false,
  searchTextForInclude: "",
  matchKanjiForInclude: false,
  matchHintForInclude: false,
  matchMeaningForInclude: false,
  matchKunyomiForInclude: false,
  matchOnyomiForInclude: false,
  tagSearchTextForInclude: "",
  tagsForInclude: [],
  setsForInclude: [],

  matchSelectedForExclude: false,
  searchTextForExclude: "",
  matchKanjiForExclude: false,
  matchHintForExclude: false,
  matchMeaningForExclude: false,
  matchKunyomiForExclude: false,
  matchOnyomiForExclude: false,
  tagSearchTextForExclude: "",
  tagsForExclude: [],
  setsForExclude: [],

  setsSelectedForModification: [],
  setModificationOperation: "add",
  tagsSelectedForModification: [],
  tagsForModificationSearchText: "",
  tagModificationOperation: "add",
};
// Reducer
/**
 *
 * @param {CardManagerState} state
 * @param {CardManagerAction} action
 * @return {CardManagerState}
 */
export default function reducer(
  state: CardManagerState,
  action: CardManagerAction
): CardManagerState {
  if (state === undefined) {
    return Object.assign({}, initialState);
  }

  switch (action.type) {
    case TOGGLE_CARD_SELECTION:
      const cardIndex = state.selectedCards.indexOf(action.payload);
      if (cardIndex < 0) {
        // add the card to those selected
        return {
          ...state,
          selectedCards: state.selectedCards.concat(action.payload).sort(),
        };
      } else {
        // remove
        return {
          ...state,
          selectedCards: state.selectedCards
            .slice(0, cardIndex)
            .concat(state.selectedCards.slice(cardIndex + 1))
            .sort(),
        };
      }
    case TOGGLE_FILTER_SELECTED:
      if (action.payload === "include") {
        return {
          ...state,
          matchSelectedForInclude: !state.matchSelectedForInclude,
        };
      } else {
        return {
          ...state,
          matchSelectedForExclude: !state.matchSelectedForExclude,
        };
      }
    case CHANGE_FILTER_TEXT_TO_MATCH:
      if (action.payload.mode === "include") {
        return {
          ...state,
          searchTextForInclude: action.payload.text,
        };
      } else {
        return {
          ...state,
          searchTextForExclude: action.payload.text,
        };
      }
    case TOGGLE_MATCH_FIELD:
      switch (action.payload.field) {
        case "kanji":
          if (action.payload.mode === "include") {
            return {
              ...state,
              matchKanjiForInclude: !state.matchKanjiForInclude,
            };
          } else {
            return {
              ...state,
              matchKanjiForExclude: !state.matchKanjiForExclude,
            };
          }
          break;
        case "hint":
          if (action.payload.mode === "include") {
            return {
              ...state,
              matchHintForInclude: !state.matchHintForInclude,
            };
          } else {
            return {
              ...state,
              matchHintForExclude: !state.matchHintForExclude,
            };
          }
          break;
        case "meaning":
          if (action.payload.mode === "include") {
            return {
              ...state,
              matchMeaningForInclude: !state.matchMeaningForInclude,
            };
          } else {
            return {
              ...state,
              matchMeaningForExclude: !state.matchMeaningForExclude,
            };
          }
          break;
        case "kunyomi":
          if (action.payload.mode === "include") {
            return {
              ...state,
              matchKunyomiForInclude: !state.matchKunyomiForInclude,
            };
          } else {
            return {
              ...state,
              matchKunyomiForExclude: !state.matchKunyomiForExclude,
            };
          }
          break;
        case "onyomi":
          if (action.payload.mode === "include") {
            return {
              ...state,
              matchOnyomiForInclude: !state.matchOnyomiForInclude,
            };
          } else {
            return {
              ...state,
              matchOnyomiForExclude: !state.matchOnyomiForExclude,
            };
          }
          break;
      }
    case CHANGE_TAG_SEARCH_TEXT:
      if (action.payload.mode === "include") {
        return {
          ...state,
          tagSearchTextForInclude: action.payload.searchText,
        };
      } else {
        return {
          ...state,
          tagSearchTextForExclude: action.payload.searchText,
        };
      }
    case CHANGE_TAGS_TO_MATCH:
      if (action.payload.mode === "include") {
        return {
          ...state,
          tagsForInclude: action.payload.tags.slice(),
        };
      } else {
        return {
          ...state,
          tagsForExclude: action.payload.tags.slice(),
        };
      }
    case CHANGE_SETS_TO_MATCH:
      if (action.payload.mode === "include") {
        return {
          ...state,
          setsForInclude: action.payload.sets.slice(),
        };
      } else {
        return {
          ...state,
          setsForExclude: action.payload.sets.slice(),
        };
      }
    case CHANGE_TAGS_TO_MODIFY_ON_SELECTED_SEARCH_TEXT:
      return {
        ...state,
        tagsForModificationSearchText: action.payload.searchText,
      };
    case CHANGE_TAGS_TO_MODIFY_ON_SELECTED:
      return {
        ...state,
        tagsSelectedForModification: action.payload.tags,
      };
    case CHANGE_TAG_OPERATION:
      return {
        ...state,
        tagModificationOperation: action.payload.operation,
      };
    case CHANGE_SETS_TO_MODIFY_ON_SELECTED:
      return {
        ...state,
        setsSelectedForModification: action.payload.sets,
      };
    case CHANGE_SET_OPERATION:
      return {
        ...state,
        setModificationOperation: action.payload.operation,
      };
    case DELETE_CARD:
      if (state.selectedCards.indexOf(action.payload) >= 0) {
        return {
          ...state,
          selectedCards: _(state.selectedCards).without(action.payload).value(),
        };
      }
    case RESET_FILTER_PARAMETERS:
      return { ...initialState };
    default:
      return state;
  }
}

// Action Creators

export type FilterMode = "include" | "exclude";
export type SelectionEditMode = "add" | "remove";
export type FilterField = "kanji" | "hint" | "meaning" | "kunyomi" | "onyomi";

type ToggleCardSelectAction = Action<
  "MorningThunder/cardManager/TOGGLE_CARD_SELECTION",
  string
>;

/**
 *
 * @param {string} id
 * @return {ToggleCardSelectAction}
 */
export function toggleCardSelection(id: string): ToggleCardSelectAction {
  return {
    type: TOGGLE_CARD_SELECTION,
    payload: id,
  };
}

type ToggleFilterSelectedAction = Action<
  "MorningThunder/cardManager/TOGGLE_FILTER_SELECTED",
  FilterMode
>;

/**
 *
 * @param {FilterMode} mode
 * @return {ToggleFilterSelectedAction}
 */
export function toggleFilterSelected(
  mode: FilterMode
): ToggleFilterSelectedAction {
  return {
    type: TOGGLE_FILTER_SELECTED,
    payload: mode,
  };
}

type ChangeFilterTextToMatchAction = Action<
  "MorningThunder/cardManager/CHANGE_FILTER_TEXT_TO_MATCH",
  { mode: FilterMode; text: string }
>;

/**
 *
 * @param {string} text
 * @param {FilterMode} mode
 * @return {ChangeFilterTextToMatchAction}
 */
export function changeFilterTextToMatch(
  text: string,
  mode: FilterMode
): ChangeFilterTextToMatchAction {
  return {
    type: CHANGE_FILTER_TEXT_TO_MATCH,
    payload: { mode, text },
  };
}

type ToggleMatchFieldAction = Action<
  "MorningThunder/cardManager/TOGGLE_MATCH_FIELD",
  {
    mode: FilterMode;
    field: FilterField;
  }
>;

/**
 *
 * @param {FilterMode} mode
 * @param {FilterField} field
 * @return {ToggleMatchFieldAction}
 */
export function toggleMatchField(
  mode: FilterMode,
  field: FilterField
): ToggleMatchFieldAction {
  return {
    type: TOGGLE_MATCH_FIELD,
    payload: {
      mode,
      field,
    },
  };
}

type ChangeTagSearchTextAction = Action<
  "MorningThunder/cardManager/CHANGE_TAG_SEARCH_TEXT",
  { mode: FilterMode; searchText: string }
>;

/**
 *
 * @param {string} searchText
 * @param {FilterMode} mode
 * @return {ChangeTagSearchTextAction}
 */
export function changeTagSearchText(
  searchText: string,
  mode: FilterMode
): ChangeTagSearchTextAction {
  return {
    type: CHANGE_TAG_SEARCH_TEXT,
    payload: { mode, searchText },
  };
}

type ChangeTagsToMatchAction = Action<
  "MorningThunder/cardManager/CHANGE_TAGS_TO_MATCH",
  { mode: FilterMode; tags: string[] }
>;

/**
 *
 * @param {string[]} tags
 * @param {FilterMode} mode
 * @return {ChangeTagsToMatchAction}
 */
export function changeTagsToMatch(
  tags: string[],
  mode: FilterMode
): ChangeTagsToMatchAction {
  return {
    type: CHANGE_TAGS_TO_MATCH,
    payload: { mode, tags },
  };
}

type ChangeSetsToMatchAction = Action<
  "MorningThunder/cardManager/CHANGE_SETS_TO_MATCH",
  { mode: FilterMode; sets: string[] }
>;

/**
 *
 * @param {string[]} sets
 * @param {FilterMode} mode
 * @return {ChangeSetsToMatchAction}
 */
export function changeSetsToMatch(
  sets: string[],
  mode: FilterMode
): ChangeSetsToMatchAction {
  return {
    type: CHANGE_SETS_TO_MATCH,
    payload: { mode, sets },
  };
}

type ChangeTagsToModifyOnSelectedSearchTextAction = Action<
  "MorningThunder/cardManager/CHANGE_TAGS_TO_MODIFY_ON_SELECTED_SEARCH_TEXT",
  { searchText: string }
>;

/**
 *
 * @param {string} searchText
 * @return {ChangeTagsToModifyOnSelectedSearchTextAction}
 */
export function changeTagsToModifyOnSelectedSearchText(
  searchText: string
): ChangeTagsToModifyOnSelectedSearchTextAction {
  return {
    type: CHANGE_TAGS_TO_MODIFY_ON_SELECTED_SEARCH_TEXT,
    payload: { searchText },
  };
}

type ChangeTagsToModifyOnSelectedAction = Action<
  "MorningThunder/cardManager/CHANGE_TAGS_TO_MODIFY_ON_SELECTED",
  { tags: string[] }
>;

/**
 *
 * @param {string[]} tags
 * @param {SelectionEditMode} mode
 * @return {ChangeTagsToModifyOnSelectedAction}
 */
export function changeTagsToModifyOnSelected(
  tags: string[],
  mode: SelectionEditMode
): ChangeTagsToModifyOnSelectedAction {
  return {
    type: CHANGE_TAGS_TO_MODIFY_ON_SELECTED,
    payload: { tags },
  };
}

type ChangeTagOperationAction = Action<
  "MorningThunder/cardManager/CHANGE_TAG_OPERATION",
  { operation: "add" | "remove" }
>;

/**
 *
 * @param {"add" | "remove"} operation
 * @return {ChangeTagOperationAction}
 */
export function changeTagOperation(
  operation: "add" | "remove"
): ChangeTagOperationAction {
  return {
    type: CHANGE_TAG_OPERATION,
    payload: { operation },
  };
}

type ChangeSetsToModifyOnSelectedAction = Action<
  "MorningThunder/cardManager/CHANGE_SETS_TO_MODIFY_ON_SELECTED",
  { sets: string[] }
>;

/**
 *
 * @param {string[]} sets
 * @return {ChangeSetsToModifyOnSelectedAction}
 */
export function changeSetsToModifyOnSelected(
  sets: string[]
): ChangeSetsToModifyOnSelectedAction {
  return {
    type: CHANGE_SETS_TO_MODIFY_ON_SELECTED,
    payload: { sets },
  };
}

type ChangeSetOperationAction = Action<
  "MorningThunder/cardManager/CHANGE_SET_OPERATION",
  { operation: "add" | "remove" }
>;

/**
 *
 * @param {"add" | "remove"} operation
 * @return {ChangeSetOperationAction}
 */
export function changeSetOperation(
  operation: "add" | "remove"
): ChangeSetOperationAction {
  return {
    type: CHANGE_SET_OPERATION,
    payload: { operation },
  };
}

export type ApplyChangesToFilteredAction = Action<
  "MorningThunder/cardManager/APPLY_CHANGES_TO_FILTERED",
  {
    cardIDs: string[];
    selectedSets: string[];
    setOperation: "add" | "remove";
    selectedTags: string[];
    tagOperation: "add" | "remove";
  }
>;

/**
 *
 * @param {string[]} cardIDs
 * @param {string[]} selectedSets
 * @param {"add" | "remove"} setOperation
 * @param {string[]} selectedTags
 * @param {"add" | "remove"} tagOperation
 * @return {ApplyChangesToFilteredAction}
 */
export function applyChangesToFiltered(
  cardIDs: string[],
  selectedSets: string[],
  setOperation: "add" | "remove",
  selectedTags: string[],
  tagOperation: "add" | "remove"
): ApplyChangesToFilteredAction {
  return {
    type: APPLY_CHANGES_TO_FILTERED,
    payload: {
      cardIDs,
      selectedSets,
      setOperation,
      selectedTags,
      tagOperation,
    },
  };
}

export type ResetFilterParametersAction = Action<
  "MorningThunder/cardManager/RESET_FILTER_PARAMETERS",
  null
>;

/**
 *
 * @return {ResetFilterParametersAction}
 */
export function resetFilterParameters(): ResetFilterParametersAction {
  return {
    type: RESET_FILTER_PARAMETERS,
    payload: null,
  };
}
