const ansiTable = {
  x: "\u001b[30m",
  r: "\u001b[31m",
  g: "\u001b[32m",
  y: "\u001b[33m",
  b: "\u001b[34m",
  p: "\u001b[35m",
  c: "\u001b[36m",
  w: "\u001b[37m",
  X: "\u001b[30;1m",
  R: "\u001b[31;1m",
  G: "\u001b[32;1m",
  Y: "\u001b[33;1m",
  B: "\u001b[34;1m",
  P: "\u001b[35;1m",
  C: "\u001b[36;1m",
  W: "\u001b[37;1m",
  e: "\u001b[0m",
  "‾": "\u203e",
};

/**
 *
 * Takes in a string with the proper formatting,
 * and outputs a string with ANSI color codes.
 *
 * Example input: `'No color ~rRed Color ~eReset'`
 *
 * Tildes cannot be used in the input string.
 * Backslashes will not escape tildes.
 *
 * @param {string} msg
 *
 * @returns {string} A formatted string with the proper escape codes to color the terminal text.
 */
const color = (msg) => {
  let out = "";
  for (let i = 0; i < msg.length; i++) {
    const v = msg[i];
    // Extra support: Turns the
    // ‾ character into it's unicode
    // equivalent for printing safety
    if (v === "‾") {
      out += ansiTable["‾"];
    }

    // If we have a tilde,
    // the next letter is a color code.
    // Get that color code from our dict,
    // or return nothing if it cannot be found.
    else if (v === "~") {
      const colorCode = msg[i + 1];
      out += ansiTable[colorCode] ?? "";
    }
    // If the letter comes directly after a tilde,
    // it is a color code. Skip it.
    else if (msg[i - 1] === "~") {
      continue;
    }
    // Otherwise, add the letters to the output.
    else {
      out += v;
    }
  }
  return out + ansiTable["e"];
};

const color_test = () => {
  const text = "Hello World!";
  const keys = Object.keys(ansiTable);

  for (const key of keys) {
    console.log(ansiTable[key] + text);
  }
};

(async function () {
  if (require.main !== module) return;
  console.clear();

  color_test();

  const { createReadline } = require("./Readline");
  const { sleep } = require("./time");
  const rl = createReadline();

  while (true) {
    const user_in = await rl.askQuestion("type some things!\n>> ");
    rl.pause();
    if (["quit", "q"].includes(user_in)) break;
    console.log(color(user_in));
    await sleep(1);
    console.log();
  }

  rl.quit();
})();

module.exports = {
  color,
};
