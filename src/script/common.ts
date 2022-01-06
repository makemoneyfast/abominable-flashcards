export enum eQuizMode {
  character,
  meaning,
  kunyomi,
  onyomi,
}
export enum eCardState {
  question = 0,
  hint = 1,
  answer = 2,
}

export interface Assets {
  sets: SetAsset[];
}

export interface SetAsset {
  name: string;
  kanji: string[];
  id: string;
}
export interface KanjiAsset {
  character: string;
  meaning: string;
  notes: string;
  onyomi: string;
  kunyomi: string;
  tags: string[]; // radicals. Maybe separate tag list for themes?
  retest: boolean; // Not defined in data but added on import.
  audio: string;
}

export interface TagAsset {
  id: string;
  name: string;
}

export interface State {
  app: AppState;
  assets: AssetsState;
  quiz: QuizState;
  setEditor: SetEditorState;
  cardEditor: CardEditorState;
  loader: LoaderState;
  cardManager: CardManagerState;
}

export interface AssetsState {
  kanji: { [key: string]: KanjiAsset };
  sets: { [key: string]: SetAsset };
  tags: { [key: string]: TagAsset };
  allSets: string[];
}

export type AppMode =
  | "load_panel"
  | "quiz"
  | "tags_panel"
  | "sets_panel"
  | "set_editor"
  | "card_editor"
  | "card_manager"
  | "set_manager"
  | "tag_manager";

export interface AppState {
  mode: AppMode;
}

export type QuizState = PopulatedQuizState | EmptyQuizState;

export interface PopulatedQuizState {
  currentSetID: string | null; // Indicates which set's button should be disabled, so can be null.
  currentTagID: string | null; // Indicates which tag's button should be disabled, so can be null.
  currentQuiz: string[]; // You can nominate the order of cards in the quiz, but I can probably get rid of this.
  currentCardIndex: number; // Index into currentQuiz
  quizMode: eQuizMode;
  cardState: eCardState;
  retesting: boolean;
}

export interface EmptyQuizState {
  currentSetID: null;
  currentTagID: null;
  currentQuiz: null;
  currentCardIndex: null;
  quizMode: eQuizMode;
  cardState: null;
  retesting: null;
}

export type SetEditorState = PopulatedSetEditorState | EmptySetEditorState;

export interface PopulatedSetEditorState {
  newSet: boolean;
  id: string | null;
  name: string;
  kanji: string[];
  modeOnExit: AppMode;
}

export interface EmptySetEditorState {
  newSet: null;
  id: null;
  name: null;
  kanji: null;
  modeOnExit: null;
}

export type CardEditorState = PopulatedCardEditorState | EmptyCardEditorState;

export interface PopulatedCardEditorState {
  id: string | null;
  kanji: string;
  hint: string;
  meaning: string;
  kunyomi: string;
  onyomi: string;
  audio: string;
  tags: string[];
  sets: string[];
  tagSearchText: string;
  newCard: boolean;
  unexportedChanges: boolean;
  unflushedChanges: boolean;
  modeOnExit: AppMode;
}

export interface EmptyCardEditorState {
  id: null;
  kanji: null;
  hint: null;
  meaning: null;
  kunyomi: null;
  onyomi: null;
  audio: null;
  tags: null;
  sets: null;
  tagSearchText: null;
  newCard: null;
  unexportedChanges: null;
  unflushedChanges: null;
  modeOnExit: null;
}

// This belongs in a duck?
export interface LoaderState {
  dataState: "uninitialized" | "no_data" | "data_loaded";
  localStorageIsBad: boolean;
  fileSelected: boolean;
  selectedFileIsBad: boolean;
  currentFileName: string;
  revisionCount: number;
  error: string | null;
}

export interface CardManagerState {
  selectedCards: string[];

  // Filter parameters
  // Filter in
  matchSelectedForInclude: boolean;
  searchTextForInclude: string;
  matchKanjiForInclude: boolean;
  matchHintForInclude: boolean;
  matchMeaningForInclude: boolean;
  matchKunyomiForInclude: boolean;
  matchOnyomiForInclude: boolean;
  tagSearchTextForInclude: string;
  tagsForInclude: string[];
  setsForInclude: string[];
  // Filter out
  matchSelectedForExclude: boolean;
  searchTextForExclude: string;
  matchKanjiForExclude: boolean;
  matchHintForExclude: boolean;
  matchMeaningForExclude: boolean;
  matchKunyomiForExclude: boolean;
  matchOnyomiForExclude: boolean;
  tagSearchTextForExclude: string;
  tagsForExclude: string[];
  setsForExclude: string[];

  // Selection edit properties
  setsSelectedForModification: string[];
  setModificationOperation: "add" | "remove";
  tagsToAdd: string[];
  tagsToRemove: string[];
  tagsToAddSearchText: string;
  tagsToRemoveSearchText: string;
}
