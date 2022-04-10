import { convertFromRaw } from "draft-js";

var rawContent = {
  blocks: [
    {
      text: "This is a Draft-based editor that supports TeX rendering.",
      type: "unstyled",
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text:
        "Each TeX block below is represented as a DraftEntity object and " +
        "rendered using Khan Academy's KaTeX library.",
      type: "unstyled",
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text: "Click any TeX block to edit.",
      type: "unstyled",
    },
    {
      text: " ",
      type: "atomic",
      entityRanges: [{ offset: 0, length: 1, key: "first" }],
    },
    {
      text: "You can also insert a new TeX block at the cursor location.",
      type: "unstyled",
    },
  ],

  entityMap: {
    first: {
      type: "TOKEN",
      mutability: "IMMUTABLE",
      data: {
        content:
          "\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n" +
          "\\left( \\sum_{k=1}^n a_k^2 \\right)\n" +
          "\\left( \\sum_{k=1}^n b_k^2 \\right)",
      },
    },
  },
};

export var content = convertFromRaw(rawContent);
