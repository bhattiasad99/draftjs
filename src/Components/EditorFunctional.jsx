import React from "react";
import Editor from "@draft-js-plugins/editor";
import { EditorState, RichUtils } from "draft-js";
import createHighlightPlugin from "./Plugins/highlightPlugin";
import addLinkPlugin from "./Plugins/AddLinkPlugin";
import "@draft-js-plugins/counter/lib/plugin.css";
import customPluginTest from "./Plugins/testing";
import Latex from "react-latex";

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
  //   executing plugins
  const highlightPlugin = createHighlightPlugin(highlightColor);
  const customPlugin = customPluginTest();

  //   add plugins to editor
  const plugins = [highlightPlugin, addLinkPlugin, customPlugin];
  //   general key command handler
  const handleKeyCommand = (command) => {
    // this will give us a new state object to pass into the setState
    // this will NOT directly update the state
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChangeHandler(newState);
      return "handled";
    } else return "not-handled";
  };

  //   events
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
  const addCustomStyle = (e) => {
    e.preventDefault();
    onChangeHandler(RichUtils.toggleInlineStyle(editorState, "custom"));
  };
  const onHeading = (e) => {
    e.preventDefault();
    onChangeHandler(RichUtils.toggleBlockType(editorState, "header-one"));
  };
  const onBlock = (e) => {
    e.preventDefault();
    onChangeHandler(RichUtils.toggleBlockType(editorState, "blockquote"));
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
  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === "blockquote") {
      return "superFancyBlockquote";
    }
  }
  const fraction = `$$\\tilde{a}$$`;
  const expression = ``;
  return (
    <>
      <Latex>{fraction}</Latex>
      <h2>
        <Latex displayMode={true}>{"$$ \\lparen hello \\rparen $$"}</Latex>
      </h2>
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
          <button onMouseDown={onBlock}>testing block</button>
          <button id="link_url" onClick={onAddLink} className="add-link">
            <i className="material-icons">attach_file</i>
          </button>
          <button onMouseDown={addCustomStyle}>red</button>
          <button onMouseDown={onHeading}>h1</button>
        </div>

        <Editor
          plugins={plugins}
          handleKeyCommand={handleKeyCommand}
          ref={editor}
          editorState={editorState}
          onChange={onChangeHandler}
          blockStyleFn={myBlockStyleFn}
        />
      </div>
    </>
  );
};

export default EditorFunctional;
