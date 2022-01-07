import * as React from "React";
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";

import { State } from "./common";
import {
  FilterMode,
  SelectionEditMode,
  toggleFilterSelected,
  changeFilterTextToMatch,
  toggleMatchField,
  changeTagSearchText,
  changeTagsToMatch,
  changeSetsToMatch,
  changeSetsToModifyOnSelected,
  changeSetOperation,
  changeTagsToModifyOnSelected,
  changeTagsToModifyOnSelectedSearchText,
  changeTagOperation,
  FilterField,
} from "./redux/cardManagerDuck";
import { toggleCardSelection } from "./redux/cardManagerDuck";
import {
  thunkEditNominatedCard,
  thunkDeleteCardAndFlush,
  thunkApplyChangesToFilteredAndFlush,
  thunkSaveNewTagAndFlush,
} from "./redux/thunks";

import { getFilteredCardsFromState } from "./redux/utility";

import CardFilter from "./CardFilter";
import TagChooser from "./TagChooser";
import SetChooser from "./SetChooser";

import _ from "Lodash";

import "./styles/cardManager.less";

interface CardManagerProps {
  visibleCards: { kanji: string; meaning: string; id: string }[];
  selectedCards: string[];
  allTags: { name: string; id: string }[];
  allSets: { name: string; id: string }[];

  includeSelected: boolean;
  includeTextToMatch: string;
  includeMatchedKanji: boolean;
  includeMatchedHint: boolean;
  includeMatchedMeaning: boolean;
  includeMatchedKunyomi: boolean;
  includeMatchedOnyomi: boolean;
  includeTagSearchText: string;
  tagsToInclude: string[];
  setsToInclude: string[];

  excludeSelected: boolean;
  excludeTextToMatch: string;
  excludeMatchedKanji: boolean;
  excludeMatchedHint: boolean;
  excludeMatchedMeaning: boolean;
  excludeMatchedKunyomi: boolean;
  excludeMatchedOnyomi: boolean;
  excludeTagSearchText: string;
  tagsToExclude: string[];
  setsToExclude: string[];

  tagsSelectedForModifySearchText: string;
  tagsSelectedForModify: string[];
  setsSelectedForModify: string[];
  setOperationForModify: "add" | "remove";
  tagOperationForModify: "add" | "remove";

  onToggleFilterSelected: (mode: FilterMode) => void;
  onChangeFilterMatchText: (test: string, mode: FilterMode) => void;
  onToggleMatchField: (mode: FilterMode, field: FilterField) => void;
  onTagSearchChange: (newText: string, mode: FilterMode) => void;
  onFilterTagsChange: (newTags: string[], mode: FilterMode) => void;
  onFilterSetsChange: (newSets: string[], mode: FilterMode) => void;

  onTagToModifySearchTextChange: (
    searchText: string,
    mode: SelectionEditMode
  ) => void;
  onTagsToModifyChange: (tags: string[], mode: SelectionEditMode) => void;
  onTagOperationChange: (operation: "add" | "remove") => void;
  onSetsSelectedForModifyChange: (sets: string[]) => void;
  onSetOperationChange: (operation: "add" | "remove") => void;
  onSaveNewTag: (newTag: string) => void;
  onApplyChangesToFiltered: () => void;

  onKanjiSelectToggle: (id: string) => void;
  onKanjiEdit: (id: string) => void;
  onKanjiDelete: (id: string) => void;
}

const BasicCardManager: React.FunctionComponent<CardManagerProps> = (
  props: CardManagerProps
) => {
  const onIncludeTagSearchChange = (newText: string) => {};
  const onIncludeTagChange = (newTags: string[]) => {};
  const noop = () => {};

  const cards = props.visibleCards.map((card) => {
    const className =
      props.selectedCards.indexOf(card.id) >= 0
        ? "matchItem selected"
        : "matchItem";
    return (
      <span
        key={card.id}
        onClick={() => props.onKanjiSelectToggle(card.id)}
        className={className}
      >
        <strong>{card.kanji}</strong> <em>{card.meaning}</em>{" "}
        <input
          type="button"
          value="編集"
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation();
            props.onKanjiEdit(card.id);
          }}
        />
        <input
          type="button"
          value="削除"
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation();
            props.onKanjiDelete(card.id);
          }}
        />
      </span>
    );
  });
  return (
    <div className="cardManager">
      <div className="sectionTitle" data-name="include">
        Include
      </div>
      <div className="sectionTitle" data-name="exclude">
        Exclude
      </div>
      <div className="filterIn">
        <CardFilter
          textToMatch={props.includeTextToMatch}
          matchKanji={props.includeMatchedKanji}
          matchHint={props.includeMatchedHint}
          matchMeaning={props.includeMatchedMeaning}
          matchKunyomi={props.includeMatchedKunyomi}
          matchOnyomi={props.includeMatchedOnyomi}
          tagSearchText={props.includeTagSearchText}
          allTags={props.allTags}
          tagsToInclude={props.tagsToInclude}
          allSets={props.allSets}
          setsToInclude={props.setsToInclude}
          onChangeSearchText={(searchText: string) =>
            props.onChangeFilterMatchText(searchText, "include")
          }
          onToggleMatch={(field: FilterField) =>
            props.onToggleMatchField("include", field)
          }
          onTagSearchChange={(tagSearchText: string) =>
            props.onTagSearchChange(tagSearchText, "include")
          }
          onFilterTagsChange={(filterTags: string[]) =>
            props.onFilterTagsChange(filterTags, "include")
          }
          onFilterSetsChange={(filterSets: string[]) =>
            props.onFilterSetsChange(filterSets, "include")
          }
        ></CardFilter>
      </div>
      <div className="filterOut">
        <CardFilter
          textToMatch={props.excludeTextToMatch}
          matchKanji={props.excludeMatchedKanji}
          matchHint={props.excludeMatchedHint}
          matchMeaning={props.excludeMatchedMeaning}
          matchKunyomi={props.excludeMatchedKunyomi}
          matchOnyomi={props.excludeMatchedOnyomi}
          tagSearchText={props.excludeTagSearchText}
          allTags={props.allTags}
          tagsToInclude={props.tagsToExclude}
          allSets={props.allSets}
          setsToInclude={props.setsToExclude}
          onChangeSearchText={(searchText: string) =>
            props.onChangeFilterMatchText(searchText, "exclude")
          }
          onToggleMatch={(field: FilterField) =>
            props.onToggleMatchField("exclude", field)
          }
          onTagSearchChange={(tagSearchText: string) =>
            props.onTagSearchChange(tagSearchText, "exclude")
          }
          onFilterTagsChange={(filterTags: string[]) =>
            props.onFilterTagsChange(filterTags, "exclude")
          }
          onFilterSetsChange={(filterSets: string[]) =>
            props.onFilterSetsChange(filterSets, "exclude")
          }
        ></CardFilter>
      </div>
      <div className="sectionTitle" data-name="modify">
        Modify
      </div>
      <div className="tagModification">
        <div className="modificationMode">
          <input
            type="button"
            value="add"
            className={
              props.tagOperationForModify === "add" ? "add selected" : "add"
            }
            onClick={() => props.onTagOperationChange("add")}
          ></input>
          <input
            type="button"
            className={
              props.tagOperationForModify === "remove"
                ? "remove selected"
                : "remove"
            }
            value="remove"
            onClick={() => props.onTagOperationChange("remove")}
          ></input>
        </div>
        <TagChooser
          allTags={props.allTags}
          selectedTags={props.tagsSelectedForModify}
          searchText={props.tagsSelectedForModifySearchText}
          allowNewTagCreation={true}
          standalone={true}
          onSearchTextChange={(newText: string) => {
            props.onTagToModifySearchTextChange(newText, "add");
          }}
          onTagChange={(newTags: string[]) => {
            props.onTagsToModifyChange(newTags, "add");
          }}
          onTagSave={(newTag: string) => props.onSaveNewTag(newTag)}
        />
      </div>
      <div className="setModification">
        <div className="modificationMode">
          <input
            type="button"
            value="add"
            className={
              props.setOperationForModify === "add" ? "add selected" : "add"
            }
            onClick={() => props.onSetOperationChange("add")}
          ></input>
          <input
            type="button"
            className={
              props.setOperationForModify === "remove"
                ? "remove selected"
                : "remove"
            }
            value="remove"
            onClick={() => props.onSetOperationChange("remove")}
          ></input>
        </div>
        <SetChooser
          allSets={props.allSets}
          selectedSets={props.setsSelectedForModify}
          onSetChange={(newSets: string[]) => {
            props.onSetsSelectedForModifyChange(newSets);
          }}
        />
      </div>
      <div className="sectionTitle" data-name="matches">
        Matches
      </div>
      <div className="cardMatches">{cards}</div>
      <div className="modificationControls">
        <input
          type="button"
          className="japanese"
          value="実行"
          onClick={props.onApplyChangesToFiltered}
        />
      </div>
    </div>
  );
};

const mapStateToProps: (state: State) => CardManagerProps = (state: State) => {
  return {
    visibleCards: getFilteredCardsFromState(state).map((cardID) => {
      const { meaning, character } = state.assets.kanji[cardID];
      return { kanji: character, meaning, id: character };
    }),
    selectedCards: state.cardManager.selectedCards,
    allTags: _(state.assets.tags)
      .map((tag) => ({ id: tag.id, name: tag.name }))
      .value(),
    allSets: _(state.assets.sets)
      .map((set) => ({
        name: set.name,
        id: set.id,
      }))
      .value(),

    includeSelected: state.cardManager.matchSelectedForInclude,
    includeTextToMatch: state.cardManager.searchTextForInclude,
    includeMatchedKanji: state.cardManager.matchKanjiForInclude,
    includeMatchedHint: state.cardManager.matchHintForInclude,
    includeMatchedMeaning: state.cardManager.matchMeaningForInclude,
    includeMatchedKunyomi: state.cardManager.matchKunyomiForInclude,
    includeMatchedOnyomi: state.cardManager.matchOnyomiForInclude,
    includeTagSearchText: state.cardManager.tagSearchTextForInclude,
    tagsToInclude: state.cardManager.tagsForInclude,
    setsToInclude: state.cardManager.setsForInclude,

    excludeSelected: state.cardManager.matchSelectedForExclude,
    excludeTextToMatch: state.cardManager.searchTextForExclude,
    excludeMatchedKanji: state.cardManager.matchKanjiForExclude,
    excludeMatchedHint: state.cardManager.matchHintForExclude,
    excludeMatchedMeaning: state.cardManager.matchMeaningForExclude,
    excludeMatchedKunyomi: state.cardManager.matchKunyomiForExclude,
    excludeMatchedOnyomi: state.cardManager.matchOnyomiForExclude,
    excludeTagSearchText: state.cardManager.tagSearchTextForExclude,
    tagsToExclude: state.cardManager.tagsForExclude,
    setsToExclude: state.cardManager.setsForExclude,

    tagsSelectedForModifySearchText:
      state.cardManager.tagsForModificationSearchText,
    tagsSelectedForModify: state.cardManager.tagsSelectedForModification,
    tagOperationForModify: state.cardManager.tagModificationOperation,
    setsSelectedForModify: state.cardManager.setsSelectedForModification,
    setOperationForModify: state.cardManager.setModificationOperation,
  } as CardManagerProps;
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => Partial<CardManagerProps> = (dispatch: Dispatch<Action>) => {
  return {
    onKanjiEdit: (id: string) =>
      dispatch(thunkEditNominatedCard(id, "card_manager") as any),
    onKanjiDelete: (id: string) => dispatch(thunkDeleteCardAndFlush(id) as any),
    onKanjiSelectToggle: (id: string) => dispatch(toggleCardSelection(id)),

    onToggleFilterSelected: (mode: FilterMode) =>
      dispatch(toggleFilterSelected(mode)),
    onChangeFilterMatchText: (text: string, mode: FilterMode) =>
      dispatch(changeFilterTextToMatch(text, mode)),
    onToggleMatchField: (mode: FilterMode, field: FilterField) =>
      dispatch(toggleMatchField(mode, field)),
    onTagSearchChange: (newText: string, mode: FilterMode) =>
      dispatch(changeTagSearchText(newText, mode)),
    onFilterTagsChange: (newTags: string[], mode: FilterMode) =>
      dispatch(changeTagsToMatch(newTags, mode)),
    onFilterSetsChange: (newSets: string[], mode: FilterMode) =>
      dispatch(changeSetsToMatch(newSets, mode)),

    onTagToModifySearchTextChange: (
      searchText: string,
      mode: SelectionEditMode
    ) => dispatch(changeTagsToModifyOnSelectedSearchText(searchText)),
    onTagsToModifyChange: (tags: string[], mode: SelectionEditMode) =>
      dispatch(changeTagsToModifyOnSelected(tags, mode)),
    onSetsSelectedForModifyChange: (sets: string[]) =>
      dispatch(changeSetsToModifyOnSelected(sets)),
    onSetOperationChange: (operation: "add" | "remove") =>
      dispatch(changeSetOperation(operation)),
    onSaveNewTag: (newTag: string) =>
      dispatch(thunkSaveNewTagAndFlush(newTag) as any),
    onTagOperationChange: (operation: "add" | "remove") =>
      dispatch(changeTagOperation(operation)),
    onApplyChangesToFiltered: () =>
      dispatch(thunkApplyChangesToFilteredAndFlush() as any),
  };
};

const CardManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicCardManager);

export default CardManager;
