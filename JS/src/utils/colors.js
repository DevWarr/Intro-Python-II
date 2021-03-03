ansi_table = {
	x: '\u001b[30m',
	r: '\u001b[31m',
	g: '\u001b[32m',
	y: '\u001b[33m',
	b: '\u001b[34m',
	p: '\u001b[35m',
	c: '\u001b[36m',
	w: '\u001b[37m',
	X: '\u001b[30;1m',
	R: '\u001b[31;1m',
	G: '\u001b[32;1m',
	Y: '\u001b[33;1m',
	B: '\u001b[34;1m',
	P: '\u001b[35;1m',
	C: '\u001b[36;1m',
	W: '\u001b[37;1m',
	e: '\u001b[0m',
	'‾': '\u203e',
};

/**
 *
 * Takes in a string with the proper formatting,
 * and outputs a string with ANSI color codes.
 *
 * Example input: "No color ~rRed Color ~eReset"
 *
 * Backslashes currently will not escape tildes.
 */
const color = (msg) => {
	let out = '';
	for (let i = 0; i < msg.length; i++) {
		// Extra support: Turns the
		// ‾ character into it's unicode
		// equivalent for printing safety
		if (char === '‾') {
			out += ansi_table[char];
		}

		// If we have a tilde,
		// the next letter is a color code.
		// Get that color code from our dict,
		// or return nothing if it cannot be found.
		else if (v === '~') {
			color = msg[i + 1];
			out += ansi_table[color] ?? '';
		}
		// If the letter comes directly after a tilde,
		// it is a color code. Skip it.
		else if (msg[i - 1] === '~') {
			continue;
		}
		// Otherwise, add the letters to the output.
		else {
			out += v;
		}
	}
	return out + ansi_table['e'];
};

const color_test = () => {
	const text = 'Hello World!';
	const keys = Object.keys(ansi_table);

	for (key of keys) {
		console.log(ansi_table[key] + text);
	}
};

(async function () {
	if (require.main === module) {
		console.clear();
		color_test();
		// while (true) {
		//     user_in = input("types some things!")
		//     if user_in == "quit":
		//       break
		//     print(user_in)
		//     await wait(1)
		// }
	}
})();
