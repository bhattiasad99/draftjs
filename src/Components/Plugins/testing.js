import { RichUtils, KeyBindingUtil } from "draft-js";

const { hasCommandModifier } = KeyBindingUtil;

export default () => {
  return {
    customStyleMap: {
      custom: {
        background: "red",
      },
    },
    keyBindingFn: (e) => {
      if (hasCommandModifier(e) && e.key === "y") {
        return "test";
      }
    },
    handleKeyCommand: (command, editorState, _, methods) => {
      if (command === "test") {
        console.log("hello");
        // window.alert("hello");
        console.log(methods);
        methods.setEditorState(
          RichUtils.toggleInlineStyle(editorState, "custom")
        );
      }
    },
  };
};
