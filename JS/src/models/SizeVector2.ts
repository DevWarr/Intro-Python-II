export interface SizeVector2 {
  w: number;
  h: number;
}

/**
 * The width and height of the font on-screen.
 *
 * With PIXI.js, monospaced fonts aren't truly monospace width-wise. Theyre only monospaced height-wise. Fun fun.
 *
 * With consolas, for example, characters can have varying font widths ranging from 8.796 to 11 pixels wide.
 *
 * This is a small variance, but it's definite;y different from the font height of 16 pixels.
 * Most characters are 8.796 or 9 pixels wide, so we'll use that as our metric.
 */
export const FONT_SIZE_PX: SizeVector2 = {
  w: 9,
  h: 16,
};
