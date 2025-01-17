/**
 * Waits a given amount of seconds.
 */
export const sleep = (secToWait: number): Promise<NodeJS.Timeout> =>
  new Promise((res) => setTimeout(res, secToWait * 1000));
