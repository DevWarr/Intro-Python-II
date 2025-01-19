import { Text, TextOptions } from "pixi.js";
import { FONT_SIZE_PX } from "../models/SizeVector2";

enum ColorLabel {
  BLACK = "x",
  RED = "r",
  GREEN = "g",
  YELLOW = "y",
  BLUE = "b",
  PURPLE = "p",
  CYAN = "c",
  WHITE = "w",
  BLACK_BOLD = "X",
  RED_BOLD = "R",
  GREEN_BOLD = "G",
  YELLOW_BOLD = "Y",
  BLUE_BOLD = "B",
  PURPLE_BOLD = "P",
  CYAN_BOLD = "C",
  WHITE_BOLD = "W",
  DEFAULT = "e",
}

const COLOR_LABEL_TO_UNICODE_COLOR: Record<ColorLabel, Partial<TextOptions>> = {
  [ColorLabel.BLACK]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#000000", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.RED]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ff0000", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.GREEN]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#00ff000", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.YELLOW]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ffff00", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.BLUE]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#0000ff", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.PURPLE]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ff00ff", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.CYAN]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#00ffff", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.WHITE]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ffffff", fontWeight: "normal" },
    y: 0,
  },
  [ColorLabel.BLACK_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#000000", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.RED_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ff0000", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.GREEN_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#00ff000", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.YELLOW_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ffff00", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.BLUE_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#0000ff", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.PURPLE_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ff00ff", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.CYAN_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#00ffff", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.WHITE_BOLD]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#ffffff", fontWeight: "bold" },
    y: -1,
  },
  [ColorLabel.DEFAULT]: {
    style: { fontFamily: "monospace", fontSize: FONT_SIZE_PX.h, fill: "#999999", fontWeight: "normal" },
    y: 0,
  },
};

/**
 * Maps a full text string with color labels, and returns a list of PIXI Text objects per character with the proper colors.
 *
 * Example input: `'default ~rred ~Wbold white'`
 *
 * Output (simplified to keep this example short - full styles should be applied):
 * ```
 * [
 *   new Text({ text: "d", style: { fill: "#999999", fontWeight: "normal" }, x: 0, y: 0 },
 *   new Text({ text: "e", style: { fill: "#999999", fontWeight: "normal" }, x: 9, y: 0 },
 *   new Text({ text: "f", style: { fill: "#999999", fontWeight: "normal" }, x: 18, y: 0 },
 *   new Text({ text: "a", style: { fill: "#999999", fontWeight: "normal" }, x: 27, y: 0 },
 *   new Text({ text: "u", style: { fill: "#999999", fontWeight: "normal" }, x: 36, y: 0 },
 *   new Text({ text: "l", style: { fill: "#999999", fontWeight: "normal" }, x: 45, y: 0 },
 *   new Text({ text: "t", style: { fill: "#999999", fontWeight: "normal" }, x: 54, y: 0 },
 *   new Text({ text: " ", style: { fill: "#999999", fontWeight: "normal" }, x: 63, y: 0 },
 *   new Text({ text: "r", style: { fill: "#ff0000", fontWeight: "normal" }, x: 72, y: 0 },
 *   new Text({ text: "e", style: { fill: "#ff0000", fontWeight: "normal" }, x: 81, y: 0 },
 *   new Text({ text: "d", style: { fill: "#ff0000", fontWeight: "normal" }, x: 90, y: 0 },
 *   new Text({ text: " ", style: { fill: "#ff0000", fontWeight: "normal" }, x: 99, y: 0 },
 *   // bold fonts display one pixel below other text,
 *   // so they need a one-pixel displacement on the y axis
 *   new Text({ text: "b", style: { fill: "#ffffff", fontWeight: "bold" }, x: 108, y: -1 },
 *   new Text({ text: "o", style: { fill: "#ffffff", fontWeight: "bold" }, x: 117, y: -1 },
 *   new Text({ text: "l", style: { fill: "#ffffff", fontWeight: "bold" }, x: 126, y: -1 },
 *   new Text({ text: "d", style: { fill: "#ffffff", fontWeight: "bold" }, x: 135, y: -1 },
 *   new Text({ text: " ", style: { fill: "#ffffff", fontWeight: "bold" }, x: 144, y: -1 },
 *   new Text({ text: "w", style: { fill: "#ffffff", fontWeight: "bold" }, x: 153, y: -1 },
 *   new Text({ text: "h", style: { fill: "#ffffff", fontWeight: "bold" }, x: 162, y: -1 },
 *   new Text({ text: "i", style: { fill: "#ffffff", fontWeight: "bold" }, x: 171, y: -1 },
 *   new Text({ text: "t", style: { fill: "#ffffff", fontWeight: "bold" }, x: 180, y: -1 },
 *   new Text({ text: "e", style: { fill: "#ffffff", fontWeight: "bold" }, x: 189, y: -1 },
 * ]
 * ```
 *
 */
export const buildTextListWithColors = (text: string): Text[] => {
  let finalTextList: Text[] = [];
  let currentColor = ColorLabel.DEFAULT;
  let currentTextOffset = 0;

  for (let i = 0; i < text.length; i++) {
    // get the character at the specified index
    const char = text[i];

    if (char === "~") {
      // If the character is a tilde, then we need to change our text style

      // Get the character after the tilde, and use that character to set our color to the proper color label
      // If the character isn't found or doesn't map to a color, then use the default color label.
      const nextChar = text[i + 1];
      currentColor = Object.values(ColorLabel).includes(nextChar as ColorLabel)
        ? (nextChar as ColorLabel)
        : ColorLabel.DEFAULT;
    } else if (text[i - 1] === "~") {
      // If the previous character was a tilde, then the current letter is just a color notation, and we can skip it
      continue;
    } else {
      // In all other situations, create a text object for the character with the proper styling and spacing.
      const newPixiText = new Text({
        ...COLOR_LABEL_TO_UNICODE_COLOR[currentColor],
        text: char,
        x: currentTextOffset * FONT_SIZE_PX.w,
      });
      finalTextList.push(newPixiText);
      currentTextOffset++;
    }
  }

  return finalTextList;
};

const LETTERS_TO_TEST = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_-‾+=!@#$%^&*()[]{}|;:,.<>?/\\";
export const textSizeTest = (fontSize: number, useIndexForXOffset: boolean) => {
  let textWidthOffset = 0;
  const pixiTextList: Text[] = LETTERS_TO_TEST.split("").map((letter, index) => {
    const newText = new Text({
      text: letter,
      style: {
        fontSize,
        fontFamily: "monospace",
        fill: "#ffffff",
        fontWeight: index % 2 ? "normal" : "bold",
      },
      x: useIndexForXOffset ? index * FONT_SIZE_PX.w : textWidthOffset,
      y: (useIndexForXOffset ? 0 : 1 * FONT_SIZE_PX.h) + (index % 2 ? 0 : -1),
    });
    textWidthOffset += newText.width;
    return newText;
  });
  // organize text items into groups categorized by width
  const widthMap: Record<number, string[]> = {};
  pixiTextList.forEach((pixiText) => {
    const width = pixiText.width;
    if (!widthMap[width]) {
      widthMap[width] = [];
    }
    widthMap[width].push(pixiText.text);
  });

  console.log(widthMap);
  return pixiTextList;
};
