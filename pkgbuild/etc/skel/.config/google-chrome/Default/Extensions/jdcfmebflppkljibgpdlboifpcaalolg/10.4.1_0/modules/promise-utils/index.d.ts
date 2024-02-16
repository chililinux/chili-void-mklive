export function backoff(totalTries: any, fn: any, delay?: number, step?: number): any;
export function delayedRetry(retries: any, fn: any, delay?: number): any;
export function pause(duration: any): Promise<any>;
export function retry(retries: any, fn: any): any;
import asyncFindIndex = require("./async-find-index");
export { asyncFindIndex };
