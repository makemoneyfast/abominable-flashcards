import { Action, UnhandledAction } from "./Action";
import { AppMode, AppState } from "../common";
import {
    EditNominatedAction,
    EndCardEditAction,
} from "./cardEditorDuck";
import * as _ from "Lodash";

// Actions
export const CHANGE_APP_STATE = "MorningThunder/app/CHANGE_APP_STATE";

export type AppAction =
    | UnhandledAction
    | ChangeAppStateAction
    | EditNominatedAction
    | EndCardEditAction;

const initialState: AppState = {
    // Have to render Loader to begin with because rendering it
    // kicks off the load from local storage.
    mode: "load_panel"
};
// Reducer
export default function reducer(state: AppState, action: AppAction): AppState {
    if (state === undefined) {
        return Object.assign({}, initialState);
    }

    switch (action.type) {
        case CHANGE_APP_STATE:
            return {
                ...state,
                mode: action.payload.mode
            };
        default:
            return state;
    }
}

// Action Creators

export type ChangeAppStateAction = Action<
    "MorningThunder/app/CHANGE_APP_STATE",
    {
        mode: AppMode;
        previousMode: AppMode | null;
    }
>;

export function changeAppState(
    newMode: AppMode | null = null,
    previousMode: AppMode | null = null
): ChangeAppStateAction {
    return {
        type: CHANGE_APP_STATE,
        payload: {
            mode: newMode !== null ? newMode : "card_manager",
            previousMode
        }
    };
}
