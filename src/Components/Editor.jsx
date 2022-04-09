import React, { Component } from "react";
import { EditorState, RichUtils } from "draft-js";
import createHighlightPlugin from "./Plugins/highlightPlugin";
import Editor from "@draft-js-plugins/editor";
import addLinkPlugin from "./Plugins/AddLinkPlugin";

const highlightPlugin = createHighlightPlugin();

const constants = {
  underline: "UNDERLINE",
  bold: "BOLD",
  italic: "ITALIC",
  highlight: "HIGHLIGHT",
};

class EditorComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.plugins = [highlightPlugin, addLinkPlugin];
  }

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  onAddLink = () => {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const link = window.prompt("Paste the link -");
    if (!link) {
      this.onChange(RichUtils.toggleLink(editorState, selection, null));
      return "handled";
    }
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
      url: link,
    });
    const newEditorState = EditorState.push(
      editorState,
      contentWithEntity,
      "create-entity"
    );
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    this.onChange(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };

  handleKeyCommand = (command) => {
    console.log(command);
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  onUnderlineClick = (event) => {
    event.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, constants.underline)
    );
  };

  onBoldClick = (event) => {
    event.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, constants.bold)
    );
  };

  onItalicClick = (event) => {
    event.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, constants.italic)
    );
  };
  onHighlight = (event) => {
    event.preventDefault();
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, constants.highlight)
    );
  };
  render() {
    return (
      <div
        style={{
          border: "1px solid black",
          padding: "0.5rem 1rem",
          margin: "0 1rem",
        }}
      >
        <button onMouseDown={this.onUnderlineClick}>
          <u>U</u>
        </button>
        <button onMouseDown={this.onBoldClick}>
          <strong>B</strong>
        </button>
        <button onMouseDown={this.onItalicClick}>
          <em>I</em>
        </button>
        <button onMouseDown={this.onHighlight}>
          <span style={{ background: "yellow", padding: "0.3em" }}>H</span>
        </button>
        <button id="link_url" onClick={this.onAddLink} className="add-link">
          <i className="material-icons">attach_file</i>
        </button>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          handleKeyCommand={this.handleKeyCommand}
          plugins={this.plugins}
        />
      </div>
    );
  }
}

export default EditorComp;
