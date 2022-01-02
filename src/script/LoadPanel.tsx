import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, Action } from "redux";

import { State } from "./common";

import { loadFromLocalStorage } from "./redux/utility";

import { thunkHandleExport, thunkAttemptToLoadFromJSON } from "./redux/thunks";
import { fileSelectionChanged } from "./redux/loaderDuck";

import "./styles/loadPanel.less";

interface LoadPanelProps {
  uninitialised: boolean;
  localStorageIsBad: boolean;
  fileSelected: boolean;
  fileSelectedIsBad: boolean;
  unsavedChanges: boolean;

  onLoadFromLocalStorage: (rawData: string | null) => void;
  onLoadFromFile: (rawData: string) => void;
  onExport: () => void;
  onFileSelectionChanged: (loaded: boolean) => void;
}

const mapStateToProps = (state: State): LoadPanelProps => {
  const setAssets = state.assets.allSets.map(
    (index) => state.assets.sets[index]
  );
  const uninitialised = state.loader.dataState === "uninitialized";
  return {
    uninitialised,
    localStorageIsBad: state.loader.localStorageIsBad,
    fileSelected: state.loader.fileSelected,
    fileSelectedIsBad: state.loader.selectedFileIsBad,
    unsavedChanges: !!state.cardEditor.unexportedChanges,
  } as LoadPanelProps;
};

const mapDispatchToProps = (
  dispatch: Dispatch<Action>
): Partial<LoadPanelProps> => {
  return {
    onLoadFromLocalStorage: (rawJSON: string | null) =>
      dispatch(thunkAttemptToLoadFromJSON(rawJSON, "local") as any),
    onLoadFromFile: (rawJSON: string) =>
      dispatch(thunkAttemptToLoadFromJSON(rawJSON, "file") as any),
    onExport: () => dispatch(thunkHandleExport() as any),
    onFileSelectionChanged: (loaded: boolean) =>
      dispatch(fileSelectionChanged(loaded)),
  };
};

class BasicLoadPanel extends React.Component<
  LoadPanelProps,
  { currentSelectedFile: File }
> {
  constructor(props: LoadPanelProps) {
    super(props);
  }

  componentDidMount() {
    if (this.props.uninitialised && !this.props.localStorageIsBad) {
      const rawJSON = loadFromLocalStorage();
      // Check for load failure here
      this.props.onLoadFromLocalStorage(rawJSON);
      // loadFromURL("/quiz.json").then(rawData => {
      //     // Check for load failure here
      //     this.props.onAssetLoad(JSON.parse(rawData));
      // });
    }
  }

  render() {
    const loaderStyle = {
      border: "#660 1px solid",
      padding: "5px",
    };

    // slightly messy code to handle the file load.
    const onLoadSelected = () => {
      const reader = new FileReader();

      reader.onload = () => {
        this.props.onLoadFromFile(reader.result as string);
      };

      reader.readAsText(this.state.currentSelectedFile);
    };

    // conditional fragments
    let status: string | undefined;
    let noData = false;
    if (this.props.localStorageIsBad) {
      status = "No saved data";
      noData = true;
    } else {
      if (this.props.unsavedChanges) {
        status = "You have some unexported changes. Don't forget to export";
      } else {
        status = undefined;
      }
    }
    let selectedFileStatus: string | undefined;
    if (this.props.fileSelectedIsBad) {
      selectedFileStatus = "The file you chose couldn't be understood.";
    } else {
      selectedFileStatus = undefined;
    }

    // In this case the loader is all we render.
    return (
      <div className="loadPanel">
        <div>
          <div>{status}</div>
          <input type="button" value="Export" onClick={this.props.onExport} />
        </div>
        <div>
          <input
            type="file"
            onChange={(event) => {
              event.persist();

              this.props.onFileSelectionChanged(
                event.target.files !== null && event.target.files.length > 0
              );

              this.setState((prevState) => {
                if (event.target.files !== null) {
                  return {
                    currentSelectedFile: event.target.files[0],
                  };
                } else {
                  throw new Error(
                    "Expected HTML element property 'files' was missing."
                  );
                }
              });
            }}
          />
          <button disabled={!this.props.fileSelected} onClick={onLoadSelected}>
            Load
          </button>
          <br />
          {selectedFileStatus}
        </div>
      </div>
    );
  }
}

//const Loader = connect(mapStateToProps, mapDispatchToProps)(BasicLoader);
const LoadPanel = connect(mapStateToProps, mapDispatchToProps)(BasicLoadPanel);

export default LoadPanel;
