import * as React from "React";
import * as ReactDom from "react-dom";
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";

import { State } from "./common";
import { thunkDeleteTagAndFlush } from "./redux/thunks";

import _ from "Lodash";

import "./styles/tagManager.less";
interface TagManagerProps {
  tags: { name: string; id: string }[];
  onTagDelete: (tagID: string) => void;
}

const BasicTagManager: React.FunctionComponent<TagManagerProps> = (
  props: TagManagerProps
) => {
  const tags = _(props.tags)
    .sortBy((tag) => tag.id)
    .map((tag) => (
      <div key={tag.id} className="tag">
        {tag.name} <input type="button" value="編集" />
        <input
          type="button"
          value="削除"
          onClick={() => props.onTagDelete(tag.id)}
        />
      </div>
    ))
    .value();
  return <div className="tagManager">{tags}</div>;
};

const mapStateToProps: (state: State) => TagManagerProps = (state: State) => {
  const tags = _(state.assets.tags)
    .map((tag) => ({ id: tag.id, name: tag.name }))
    .value();
  return { tags } as TagManagerProps;
};

const mapDispatchToProps: (
  dispatch: Dispatch<Action>
) => Partial<TagManagerProps> = (dispatch: Dispatch<Action>) => {
  return {
    onTagDelete: (tagID: string) =>
      dispatch(thunkDeleteTagAndFlush(tagID) as any),
  };
};

const TagManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicTagManager);

export default TagManager;
