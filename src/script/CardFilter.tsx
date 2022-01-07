import * as React from "react";

import _ from "Lodash";

import TagChooser from "./TagChooser";
import SetChooser from "./SetChooser";

import "./styles/cardFilter.less";

interface CardFilterProps {
  textToMatch: string;
  matchKanji: boolean;
  matchHint: boolean;
  matchMeaning: boolean;
  matchKunyomi: boolean;
  matchOnyomi: boolean;
  tagSearchText: string;
  allTags: { name: string; id: string }[];
  tagsToInclude: string[];
  allSets: { name: string; id: string }[];
  setsToInclude: string[];
  onChangeSearchText: (text: string) => void;
  onToggleMatch: (
    type: "kanji" | "hint" | "meaning" | "kunyomi" | "onyomi"
  ) => void;
  onTagSearchChange: (text: string) => void;
  onFilterTagsChange: (newTags: string[]) => void;
  onFilterSetsChange: (newSets: string[]) => void;
}

class CardFilter extends React.Component<CardFilterProps> {
  constructor(props: CardFilterProps) {
    super(props);
  }

  render() {
    return (
      <div className="cardFilter">
        <h3>Filter</h3>
        <div className="filterControls">
          <label>
            Find{" "}
            <input
              type="text"
              value={this.props.textToMatch}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.props.onChangeSearchText(event.target.value);
              }}
            />
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={this.props.matchKanji}
              onChange={() => this.props.onToggleMatch("kanji")}
            />{" "}
            kanji{" "}
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.matchHint}
              onChange={() => this.props.onToggleMatch("hint")}
            />{" "}
            hint{" "}
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.matchMeaning}
              onChange={() => this.props.onToggleMatch("meaning")}
            />{" "}
            meaning{" "}
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.matchKunyomi}
              onChange={() => this.props.onToggleMatch("kunyomi")}
            />{" "}
            kunyomi
          </label>
          <label>
            <input
              type="checkbox"
              checked={this.props.matchOnyomi}
              onChange={() => this.props.onToggleMatch("onyomi")}
            />{" "}
            onyomi
          </label>
        </div>
        <h3>Tags</h3>
        <TagChooser
          allTags={this.props.allTags}
          selectedTags={this.props.tagsToInclude}
          searchText={this.props.tagSearchText}
          allowNewTagCreation={false}
          standalone={true}
          onSearchTextChange={(newText: string) => {
            this.props.onTagSearchChange(newText);
          }}
          onTagChange={(newTags: string[]) => {
            this.props.onFilterTagsChange(newTags);
          }}
          onTagSave={() => undefined}
        />
        <h3>Sets</h3>
        <SetChooser
          allSets={this.props.allSets}
          selectedSets={this.props.setsToInclude}
          onSetChange={(newSets: string[]) => {
            this.props.onFilterSetsChange(newSets);
          }}
        />
      </div>
    );
  }
}
export default CardFilter;
