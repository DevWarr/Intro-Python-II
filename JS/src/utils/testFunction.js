const assert = require('assert').strict;
const { color } = require('./colors');

/**
 * Spies on a method within an object, and allows to you force a 'mocked' return value.
 *
 * This function REQUIRES an object, and a methodName in order to create a mock and spy.
 *
 * This function does not return anything, but instead updates the given method with three properties:
 * - `setReturnValue`: Allows you to set the return value for the spied function
 * - `calls`: The number of times the function has been called
 * - `resetMethod`: Allows you to reset the method to it's original function
 *
 * @param {{}} obj - the Object that holds the method you want to mock
 * @param {string} methodName - the name of the method you want to mock
 */
const createSpyAndMock = (obj, methodName) => {
	let calls = [];
	const originalFunction = obj[methodName].bind({});

    // Setting up properties for spying
    obj[methodName].calls = calls.length;
    obj[methodName].resetMethod = () => {
        obj[methodName] = originalFunction;
    };

    // setting the initial function with spying
	obj[methodName] = (...args) => {
		calls.push(args);
		obj[methodName].calls = calls.length;
        obj[methodName].lastCalledWith = calls[calls.length - 1]
		obj[methodName].resetMethod = () => {
            obj[methodName] = originalFunction;
		};
		return originalFunction(...args);
	};
    
    // setting up the mock function with spying
	obj[methodName].setReturnValue = (returnValue) => {
        obj[methodName] = (...args) => {
            calls.push(args);
			obj[methodName].calls = calls.length;
            obj[methodName].lastCalledWith = calls[calls.length - 1]
			obj[methodName].resetMethod = () => {
				obj[methodName] = originalFunction;
			};
			return returnValue;
		};
	};
};

const test = async (testObj) => {
	const testName = Object.keys(testObj)[0];
	const testInfo = testObj[testName];
	try {
		if (Array.isArray(testInfo)) await describe(testName, testInfo, true);
		else {
			process.stdout.write(color(`~W[ ] ~e~y${testName}~e`));
			await testInfo();
			process.stdout.write(color(`\r~G[✓] ~e~y${testName}~e\n`));
		}
	} catch (err) {
		process.stdout.write(color(`\r~R[X] ~e~p${testName}~e\n`));
		const errorMessage = err.message;
		console.error(`${errorMessage}\n`);
	}
};

/**
 * Main function block for testing.
 *
 * You can nest test names together inside the `testArray` parameter:
 * The objects inside `testArray` will still have keys that are the name of the test.
 * However, instead of a Function of the test, another `testArray` can be passed in,
 * allowing for nested tests.
 *
 * `describe()` calls a test function that will automatically detect if another `testArray`
 * has been passed in, allowing for nested tests.
 *
 * @param {string} str
 * @param {[{[string]: Function | []}]} testsArray
 * @param {boolean} nested
 */
const describe = async (str, testsArray, nested = false) => {
	console.log(color(`${nested ? '' : '~W'}${str}`));
	try {
		for (testObj of testsArray) {
			await test(testObj);
		}
	} catch (err) {
		console.error(err);
	}
	if (!nested) console.log();
};

assertEquals = (value, compare) => {
	assert.equal(value, compare);
};

assertMatch = (value, regex) => {
	assert.match(value, regex);
};

const assertLessThan = (value, compare) => {
	try {
		assert.equal(value < compare, true);
	} catch (err) {
		throw { message: `${value} is not less than ${compare}` };
	}
};

const assertGreaterThan = (value, compare) => {
	try {
		assert.equal(value > compare, true);
	} catch (err) {
		throw { message: `${value} is not greater than ${compare}` };
	}
};

const assertLessThanOrEqualTo = (value, compare) => {
	try {
		assert.equal(value <= compare, true);
	} catch (err) {
		throw { message: `${value} is not less than or equal to ${compare}` };
	}
};

const assertGreaterThanOrEqualTo = (value, compare) => {
	try {
		assert.equal(value >= compare, true);
	} catch (err) {
		throw { message: `${value} is not greater than or equal to ${compare}` };
	}
};

const assertIncludes = (array, value) => {
	try {
		assert.equal(array.includes(value), true);
	} catch (err) {
		if (array.length > 1000) array = 'the array (not printed because length exceeds 1000)';
		throw { message: `${value} is not in ${array}` };
	}
};

const assertThrows = (functionThatShouldThrow, errorThrown) => {
	assert.throws(functionThatShouldThrow, errorThrown);
};

module.exports = {
	describe,
    createSpyAndMock,
	assertEquals,
	assertMatch,
	assertIncludes,
	assertThrows,
	assertGreaterThan,
	assertGreaterThanOrEqualTo,
	assertLessThan,
	assertLessThanOrEqualTo,
};
