import { RichUtils, KeyBindingUtil } from "draft-js";
const { hasCommandModifier } = KeyBindingUtil;
export default (color) => {
  return {
    customStyleMap: {
      HIGHLIGHT: {
        background: color,
      },
    },
    hello() {
      console.log(color);
    },
    // for guidelines
    // https://draftjs.org/docs/api-reference-editor/#keybindingfn
    keyBindingFn: (e) => {
      if (hasCommandModifier(e) && e.key === "h") {
        return "highlight";
      }
    },

    // Handle key command will take 4th parameter as an object with methods instead of 3rd as class based components
    handleKeyCommand: (command, editorState, _, methods) => {
      if (command === "highlight") {
        methods.setEditorState(
          RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT")
        );
        return true;
      }
    },
  };
};
