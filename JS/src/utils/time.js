/**
 * Waits a given amount of seconds.
 *
 * @param {number} secToWait
 *
 * @returns {Promise<setTimeout>} Promise of a setTimeout, in order to wait a certain amount of time
 */
exports.sleep = (secToWait) => new Promise((res) => setTimeout(res, secToWait * 1000));
