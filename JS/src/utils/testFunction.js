const { color } = require('./colors')

const test = async (str, func) => {
    try {
        process.stdout.write(color(`~W[ ] ~e~y${str}~e`))
        await func()
        process.stdout.write(color(`\r~G[✓] ~e~y${str}~e\n`))
    } catch (err) {
        process.stdout.write(color(`\r~R[X] ~e~y${str}~e\n`))
        const errorMessage = err.message
        console.error(errorMessage)
    }
}

module.exports = test
