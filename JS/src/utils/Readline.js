const readline = require('readline');
const util = require('util');

const createReadline = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const promisifiedQuestion = util.promisify(rl.question).bind(rl)
	
	const askQuestion = async (message) => {
		try {
			return await promisifiedQuestion(message);
		} catch (err) {
			return err
		}
	}

	return {
		askQuestion,
		quit: rl.close.bind(rl)
	}
};

(async function () {
	if (require.main !== module) return
	const rl = createReadline()
	const answer = await rl.askQuestion("What is your name? ");
	console.log(answer)
	rl.quit()

})()

exports.createReadline = createReadline