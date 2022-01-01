import * as _ from "Lodash";

import appReducer from "./appDuck";
import quizReducer from "./quizDuck";
import assetsReducer from "./assetsDuck";
import setEditorReducer from "./setEditorDuck";
import cardEditorReducer from "./cardEditorDuck";
import loaderReducer from "./loaderDuck";
import cardManager from "./cardManagerDuck";
import { combineReducers } from "redux";

const reducer = combineReducers({
    app: appReducer,
    assets: assetsReducer,
    quiz: quizReducer,
    setEditor: setEditorReducer,
    cardEditor: cardEditorReducer,
    loader: loaderReducer,
    cardManager: cardManager
});
// Reducer
export default reducer;
