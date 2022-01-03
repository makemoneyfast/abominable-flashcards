import { Action, UnhandledAction } from "./Action";
import { SetEditorState, PopulatedSetEditorState, EmptySetEditorState } from "../common";
import { ChangeAppStateAction, CHANGE_APP_STATE } from "./appDuck";
import _ from "Lodash";

// Actions
export const EDIT_NOMINATED_SET = "MorningThunder/setEditor/EDIT_NOMINATED_SET";
export const EDIT_NEW_SET = "MorningThunder/setEditor/EDIT_NEW_SET";
export const UPDATE_SET_BUFFER_NAME =
    "MorningThunder/setEditor/UPDATE_SET_BUFFER_NAME";
export const REMOVE_KANJI_FROM_SET_BUFFER =
    "MorningThunder/setEditor/REMOVE_KANJI_FROM_SET_BUFFER";
export const SAVE_NEW_SET = "MorningThunder/setEditor/SAVE_NEW_SET";
export const SAVE_EXISTING_SET = "MorningThunder/setEditor/SAVE_EXISTING_SET";
export const END_SET_EDIT = "MorningThunder/setEditor/END_SET_EDIT";

export type SetEditorAction =
    | UnhandledAction
    | ChangeAppStateAction
    | EditNominatedSetAction
    | EditNewSetAction
    | EndSetEditAction
    | UpdateSetBufferNameAction
    | RemoveKanjiFromSetBufferAction;

const initialState: SetEditorState = {
    // This is effectively the edit buffer.
    newSet: null,
    id: null,
    name: null,
    kanji: null,
    modeOnExit: null
};
// Reducer
export default function reducer(
    state: SetEditorState,
    action: SetEditorAction
): SetEditorState {
    if (state === undefined) {
        return Object.assign({}, initialState);
    }

    switch (action.type) {
        case CHANGE_APP_STATE:
            if (action.payload.mode === "set_editor") {
                return {
                    ...state,
                    modeOnExit: action.payload.previousMode
                } as PopulatedSetEditorState;
            } else {
                return state;
            }
        case EDIT_NEW_SET:
            return {
                ...state,
                newSet: true,
                id: null,
                name: "",
                kanji: []
            } as PopulatedSetEditorState;
        case EDIT_NOMINATED_SET:
            return {
                ...state,
                newSet: false,
                id: action.payload.id,
                name: action.payload.name,
                kanji: action.payload.kanji
            } as PopulatedSetEditorState;
        case END_SET_EDIT:
            return {
                ...state,
                newSet: null,
                id: null,
                name: null,
                kanji: null,
                modeOnExit: null,
            } as EmptySetEditorState;
        case UPDATE_SET_BUFFER_NAME:
            return {
                ...state,
                name: action.payload
            } as PopulatedSetEditorState;
        case REMOVE_KANJI_FROM_SET_BUFFER:
            return {
                ...state,
                kanji: _(state.kanji)
                    .without(action.payload)
                    .value()
            } as PopulatedSetEditorState;
        default:
            return state;
    }
}

// Action Creators

export interface SetEditBuffer {
    id: string | undefined;
    kanji: string[];
    name: string;
}

export type EditNominatedSetAction = Action<
    "MorningThunder/setEditor/EDIT_NOMINATED_SET",
    SetEditBuffer
>;

export function editNominatedSet(set: SetEditBuffer): EditNominatedSetAction {
    return { type: EDIT_NOMINATED_SET, payload: set };
}

export type EditNewSetAction = Action<
    "MorningThunder/setEditor/EDIT_NEW_SET",
    null
>;

export function editNewSet(): EditNewSetAction {
    return { type: EDIT_NEW_SET, payload: null };
}

export type UpdateSetBufferNameAction = Action<
    "MorningThunder/setEditor/UPDATE_SET_BUFFER_NAME",
    string
>;

export function updateSetBufferName(name: string): UpdateSetBufferNameAction {
    return { type: UPDATE_SET_BUFFER_NAME, payload: name };
}

export type RemoveKanjiFromSetBufferAction = Action<
    "MorningThunder/setEditor/REMOVE_KANJI_FROM_SET_BUFFER",
    string
>;

export function removeKanjiFromSetBuffer(
    tagID: string
): RemoveKanjiFromSetBufferAction {
    return { type: REMOVE_KANJI_FROM_SET_BUFFER, payload: tagID };
}

export type SaveExistingSetAction = Action<
    "MorningThunder/setEditor/SAVE_EXISTING_SET",
    { id: string, name: string, kanji: string[] }
>;

export function saveExistingSet(id: string, name: string, kanji: string[]): SaveExistingSetAction {
    return {
        type: SAVE_EXISTING_SET,
        payload: {
            id, name, kanji
        }
    };
}

export type SaveNewSetAction = Action<
    "MorningThunder/setEditor/SAVE_NEW_SET",
    { name: string, kanji: string[] }
>;

export function saveNewSet(name: string, kanji: string[]): SaveNewSetAction {
    return {
        type: SAVE_NEW_SET,
        payload: {
            name, kanji
        }
    };
}

export type EndSetEditAction = Action<
    "MorningThunder/setEditor/END_SET_EDIT",
    null
>;

export function endSetEdit(): EndSetEditAction {
    return { type: END_SET_EDIT, payload: null };
}
