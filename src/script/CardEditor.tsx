import * as React from "react";

import { Dispatch, Action } from "redux";
import { connect } from "react-redux";

import { PopulatedCardEditorState, State } from "./common";

import TagChooser from "./TagChooser";

import {
  updateCardBufferCharacter,
  updateCardBufferKunyomi,
  updateCardBufferOnyomi,
  updateCardBufferHint,
  updateCardBufferAnswer,
  updateCardBufferNewTag,
  updateCardBufferAudio,
  changeCardBufferTags,
  addSetToCardBuffer,
  removeSetFromCardBuffer,
} from "./redux/cardEditorDuck";

import { thunkSaveNewTagAndFlush } from "./redux/thunks";

import _ from "Lodash";

import "./styles/cardEditor.less";

interface CardEditorProps {
  newCard: boolean;
  character: string;
  hint: string;
  answer: string;
  kunyomi: string;
  onyomi: string;
  audio: string;

  allTags: { name: string; id: string }[];
  selectedTags: string[];
  tagSearchText: string;

  onNewTagSave: (newTag: string) => void;
  onTagSearchTextChange: (newTagSearchText: string) => void;
  onSelectedTagsChange: (selectedTags: string[]) => void;

  newCardAlreadyExists: boolean;
  availableSets: { name: string; id: string; linked: boolean }[];

  setAssigned: boolean;
  idDefined: boolean;
  idCollision: boolean;
  unsavedChanges: boolean;

  onCharacterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHintChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKunyomiChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOnyomiChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetLinkChange: (setID: string, link: boolean) => void;
}

class BasicCardEditor extends React.Component<CardEditorProps> {
  constructor(props: CardEditorProps) {
    super(props);
  }

  render() {
    const availableSets = _(this.props.availableSets)
      .map((set) => {
        const classNames = ["setItem"];
        if (set.linked) {
          classNames.push("selected");
        }
        if (!this.props.newCard) {
          classNames.push("disabled");
        } else {
          classNames.push("clickable");
        }
        return (
          <div
            key={set.id}
            className={classNames.join(" ")}
            onClick={() =>
              this.props.newCard
                ? this.props.onSetLinkChange(set.id, !set.linked)
                : undefined
            }
          >
            {set.name}
          </div>
        );
      })
      .value();

    let validatorMessage: string | null = null;
    if (!this.props.idDefined) {
      validatorMessage = "Enter a kanji to test";
    } else if (this.props.idCollision) {
      validatorMessage = "A card for this kanji already exists";
    } else if (!this.props.setAssigned) {
      validatorMessage = "Choose a set for this card";
    } else if (!this.props.unsavedChanges) {
      validatorMessage = "No changes made";
    }

    return (
      <div className="cardEditor">
        <div className="validation">{validatorMessage}</div>
        <div className="formCaption">Kanji:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.character}
            onChange={this.props.onCharacterChange}
            disabled={!this.props.newCard}
          />
          <br />
          {this.props.newCardAlreadyExists ? (
            <strong>A card with this text already exists</strong>
          ) : null}
        </div>
        <div className="formCaption">Hint:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.hint}
            onChange={this.props.onHintChange}
          />
        </div>
        <div className="formCaption">Answer:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.answer}
            onChange={this.props.onAnswerChange}
          />
        </div>
        <div className="formCaption">Kunyomi:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.kunyomi}
            onChange={this.props.onKunyomiChange}
          />
        </div>
        <div className="formCaption">Onyomi:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.onyomi}
            onChange={this.props.onOnyomiChange}
          />
        </div>
        <div className="formCaption">Audio:</div>
        <div className="formInput">
          <input
            type="string"
            value={this.props.audio}
            onChange={this.props.onAudioChange}
          />
        </div>
        <div className="setChooser">{availableSets}</div>
        <TagChooser
          allTags={this.props.allTags}
          selectedTags={this.props.selectedTags}
          searchText={this.props.tagSearchText}
          allowNewTagCreation={true}
          onSearchTextChange={this.props.onTagSearchTextChange}
          onTagSave={this.props.onNewTagSave}
          onTagChange={this.props.onSelectedTagsChange}
        />
      </div>
    );
  }
}
/*

*/

const mapStateToProps: (state: State) => CardEditorProps = (state: State) => {
  if (state.cardEditor.kanji === null) {
    return {
      newCard: false,
      character: "",
      hint: "",
      answer: "",
      kunyomi: "",
      onyomi: "",
      audio: "",

      allTags: [] as any,
      selectedTags: [] as any,
      tagSearchText: "",

      availableSets: [] as any,
      idCollision: false,
      idDefined: true,
      setAssigned: true,
      unsavedChanges: false,
    } as CardEditorProps;
  }
  // Tags
  const allTags = _(state.assets.tags)
    .map((tag) => ({ id: tag.id, name: tag.name }))
    .value();

  const availableSets = _(state.assets.sets)
    .map((set) => {
      return {
        name: set.name,
        id: set.id,
        linked: set.kanji.includes(
          (state.cardEditor as PopulatedCardEditorState).kanji
        ),
      };
    })
    .value();

  // Validation
  let setAssigned = false;
  let idDefined = false;
  let idCollision = false;
  let unsavedChanges = false;

  if (state.cardEditor.newCard) {
    idDefined = state.cardEditor.kanji !== "";
    idCollision = state.assets.kanji[state.cardEditor.kanji] !== undefined;
    setAssigned =
      (state.cardEditor as PopulatedCardEditorState).sets.length > 0;

    unsavedChanges =
      state.cardEditor.kanji !== "" ||
      state.cardEditor.hint !== "" ||
      state.cardEditor.meaning !== "" ||
      state.cardEditor.kunyomi !== "" ||
      state.cardEditor.onyomi !== "" ||
      state.cardEditor.audio !== "" ||
      state.cardEditor.tags.length !== 0; /// O MY GOD HAVE TO FIX THIS OM
  } else {
    const currentCard =
      state.assets.kanji[(state.cardEditor as PopulatedCardEditorState).kanji];
    idDefined = true;
    setAssigned = true;

    unsavedChanges =
      state.cardEditor.hint !== currentCard.notes ||
      state.cardEditor.meaning !== currentCard.meaning ||
      state.cardEditor.kunyomi !== currentCard.kunyomi ||
      state.cardEditor.onyomi !== currentCard.onyomi ||
      state.cardEditor.audio !== currentCard.audio ||
      state.cardEditor.tags.toString() !==
        (currentCard.tags ? currentCard.tags.toString() : "");
  }

  return {
    newCard: state.cardEditor.newCard,
    character: state.cardEditor.kanji,
    hint: state.cardEditor.hint,
    answer: state.cardEditor.meaning,
    kunyomi: state.cardEditor.kunyomi,
    onyomi: state.cardEditor.onyomi,
    audio: state.cardEditor.audio,

    allTags: allTags,
    selectedTags: state.cardEditor.tags,
    tagSearchText: state.cardEditor.tagSearchText,

    availableSets,
    idCollision,
    idDefined,
    setAssigned,
    unsavedChanges,
  } as CardEditorProps;
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => Partial<CardEditorProps> = (dispatch: Dispatch<Action>) => {
  return {
    onCharacterChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferCharacter(event.target.value));
    },
    onHintChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferHint(event.target.value));
    },
    onAnswerChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferAnswer(event.target.value));
    },
    onKunyomiChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferKunyomi(event.target.value));
    },
    onOnyomiChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferOnyomi(event.target.value));
    },
    onAudioChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCardBufferAudio(event.target.value));
    },
    onTagSearchTextChange: (newTagSearchText: string) => {
      dispatch(updateCardBufferNewTag(newTagSearchText));
    },
    onNewTagSave: (newTag: string) => {
      dispatch(thunkSaveNewTagAndFlush(newTag) as any);
    },
    onSelectedTagsChange: (updatedTags: string[]) => {
      dispatch(changeCardBufferTags(updatedTags));
    },
    onSetLinkChange: (setID: string, link: boolean) => {
      if (link) {
        dispatch(addSetToCardBuffer(setID));
      } else {
        dispatch(removeSetFromCardBuffer(setID));
      }
    },
  };
};

const CardEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicCardEditor);
export default CardEditor;
