export = setRandomInterval;
/**
 * Repeatedly calls a function with a random time delay between each call.
 *
 * @param intervalFunction - A function to be executed at random times between `minDelay` and
 * `maxDelay`. The function is not passed any arguments, and no return value is expected.
 * @param minDelay - The minimum amount of time, in milliseconds (thousandths of a second), the
 * timer should delay in between executions of `intervalFunction`.
 * @param maxDelay - The maximum amount of time, in milliseconds (thousandths of a second), the
 * timer should delay in between executions of `intervalFunction`.
 */
declare function setRandomInterval(intervalFunction: any, minDelay?: number, maxDelay?: number): {
    clear(): void;
};
