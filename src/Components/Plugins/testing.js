import { RichUtils, KeyBindingUtil } from "draft-js";

const { hasCommandModifier } = KeyBindingUtil;

export default () => {
  return {
    customStyleMap: {
      custom: {
        background: "green",
      },
    },
    keyBindingFn: (e) => {
      if (hasCommandModifier(e) && e.key === "y") {
        return "test";
      }
    },
    handleKeyCommand: (command, editorState, _, methods) => {
      if (command === "test") {
        methods.setEditorState(
          RichUtils.toggleInlineStyle(editorState, "custom")
        );
      }
    },
  };
};
