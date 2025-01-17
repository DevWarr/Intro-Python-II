const readline = require("readline");
const util = require("util");

const createReadline = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const promisifiedQuestion = util.promisify(rl.question).bind(rl);

  /**
   *
   * @param {string} message
   *
   * @returns {string} user input
   */
  const askQuestion = async (message) => {
    try {
      return await promisifiedQuestion(message);
    } catch (err) {
      return err;
    }
  };

  return {
    askQuestion,
    pause: () => rl.pause(),
    quit: () => rl.close(),
  };
};

(async function () {
  if (require.main !== module) return;
  const rl = createReadline();
  const answer = await rl.askQuestion("What is your name? ");
  console.log(answer);
  rl.quit();
})();

exports.createReadline = createReadline;
