import React from "react";
import Editor from "@draft-js-plugins/editor";
import { EditorState, RichUtils } from "draft-js";
import createHighlightPlugin from "./Plugins/highlightPlugin";
import addLinkPlugin from "./Plugins/AddLinkPlugin";
import "@draft-js-plugins/counter/lib/plugin.css";
import customPluginTest from "./Plugins/testing";

const constants = {
  underline: "UNDERLINE",
  bold: "BOLD",
  italic: "ITALIC",
  highlight: "HIGHLIGHT",
};

const EditorFunctional = () => {
  const editor = React.useRef(null);
  const counter = React.useRef(null);
  const [highlightColor, setHighlightColor] = React.useState("#fffe0d");
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  );
  const onChangeHandler = (editorState) => {
    setEditorState(editorState);
  };
  const highlightPlugin = createHighlightPlugin(highlightColor);
  const customPlugin = customPluginTest();
  const plugins = [highlightPlugin, addLinkPlugin, customPlugin];
  const handleKeyCommand = (command) => {
    // this will give us a new state object to pass into the setState
    // this will NOT directly update the state
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChangeHandler(newState);
      return "handled";
    } else return "not-handled";
  };

  const onUnderlineClick = (e) => {
    e.preventDefault();
    onChangeHandler(
      RichUtils.toggleInlineStyle(editorState, constants.underline)
    );
  };
  const onBoldClick = (e) => {
    e.preventDefault();
    onChangeHandler(RichUtils.toggleInlineStyle(editorState, constants.bold));
  };
  const onItalicClick = (e) => {
    e.preventDefault();
    onChangeHandler(RichUtils.toggleInlineStyle(editorState, constants.italic));
  };
  const onHighlight = (e) => {
    e.preventDefault();
    onChangeHandler(
      RichUtils.toggleInlineStyle(editorState, constants.highlight)
    );
  };
  // adds link
  const onAddLink = (e) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    const link = window.prompt("Paste the link -");
    if (!link) {
      onChangeHandler(RichUtils.toggleLink(editorState, selection, null));
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
    onChangeHandler(RichUtils.toggleLink(newEditorState, selection, entityKey));
    return "handled";
  };

  return (
    <div style={{ border: "1px solid grey" }}>
      <div style={{ display: "flex" }}>
        <button onMouseDown={onUnderlineClick}>
          <u>U</u>
        </button>
        <button onMouseDown={onBoldClick}>
          <strong>B</strong>
        </button>
        <button onMouseDown={onItalicClick}>
          <em>I</em>
        </button>
        <button onMouseDown={onHighlight}>
          <span style={{ background: "yellow", padding: "0.3em" }}>H</span>
        </button>

        <button id="link_url" onClick={onAddLink} className="add-link">
          <i className="material-icons">attach_file</i>
        </button>
      </div>

      <Editor
        plugins={plugins}
        handleKeyCommand={handleKeyCommand}
        ref={editor}
        editorState={editorState}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default EditorFunctional;
