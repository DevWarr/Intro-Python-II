const assert = require('assert').strict
const { color } = require('./colors')

const test = async (testObj) => {
    const testName = Object.keys(testObj)[0]
    const testInfo = testObj[testName]
    try {
        if (Array.isArray(testInfo)) await describe(testName, testInfo, true)
        else {
            process.stdout.write(color(`~W[ ] ~e~y${testName}~e`))
            await testInfo()
            process.stdout.write(color(`\r~G[✓] ~e~y${testName}~e\n`))
        }
    } catch (err) {
        process.stdout.write(color(`\r~R[X] ~e~p${testName}~e\n`))
        const errorMessage = err.message
        console.error(`${errorMessage}\n`)
    }
}

const describe = async (str, testsArray, nested = false) => {
    console.log(color(`${nested ? '' : '~W'}${str}`))
    try {
        for (testObj of testsArray) {
            await test(testObj)
        }
    } catch (err) {
        console.error(err)
    }
    if (!nested) console.log()
}

const assertLessThan = (value, compare) => {
    try {
        assert.equal(value < compare, true)
    } catch (err) {
        throw {message: `${value} is not less than ${compare}`}
    }
}

const assertGreaterThan = (value, compare) => {
    try {
        assert.equal(value > compare, true)
    } catch (err) {
        throw {message: `${value} is not greater than ${compare}`}
    }
}

const assertLessThanOrEqualTo = (value, compare) => {
    try {
        assert.equal(value <= compare, true)
    } catch (err) {
        throw {message: `${value} is not less than or equal to ${compare}`}
    }
}

const assertGreaterThanOrEqualTo = (value, compare) => {
    try {
        assert.equal(value >= compare, true)
    } catch (err) {
        throw {message: `${value} is not greater than or equal to ${compare}`}
    }
}

const assertIncludes = (array, value) => {
    try {
        assert.equal(array.includes(value), true);
    } catch (err) {
        if (array.length > 1000) array = 'the array (not printed because length exceeds 1000)'
        throw{message: `${value} is not in ${array}`}
    }
}

module.exports = {
    test,
    describe,
    assertIncludes,
    assertGreaterThan,
    assertGreaterThanOrEqualTo,
    assertLessThan,
    assertLessThanOrEqualTo
}
