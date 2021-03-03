const { color } = require('./colors')

const test = async (str, func) => {
    try {
        process.stdout.write(color(`~W[ ] ~e~y${str}~e`))
        await func()
        process.stdout.write(color(`\r~G[✓] ~e~y${str}~e\n`))
    } catch (err) {
        process.stdout.write(color(`\r~R[X] ~e~p${str}~e\n`))
        const errorMessage = err.message
        console.error(`${errorMessage}\n`)
    }
}

const describe = async (str, testsArray) => {
    console.log(str)
    for (testInfo of testsArray) {
        await test(...testInfo)
    }
    console.log()
}

module.exports = {
    test,
    describe
}
