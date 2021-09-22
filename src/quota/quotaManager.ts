import { Dequeue } from '../dequeue';
import { Quota } from './quota';

/** keep track of API invocations, allowing or disallowing them based on our quota */
export class QuotaManager {
  protected _activeCount = 0;
  protected history = new Dequeue();
  protected _effectiveRate: number;

  constructor(protected _quota: Quota) {
    if (typeof _quota !== 'object') {
      console.warn(
        '[p-ratelimit QuotaManager] A QuotaManager was created with no quota.'
      );
      this._quota = {};
    }

    if (
      ('interval' in this._quota && !('rate' in this._quota)) ||
      ('rate' in this._quota && !('interval' in this._quota))
    ) {
      const msg =
        `[p-ratelimit QuotaManager] Invalid Quota: for a rate-limit quota, both ` +
        `interval and rate must be specified.`;
      throw new Error(msg);
    }

    this._effectiveRate = this._quota.rate;
  }

  /** The current quota */
  get quota() {
    return Object.assign({}, this._quota);
  }

  /** The number of currently-active invocations */
  get activeCount() {
    return this._activeCount;
  }

  /** Max amount of time a queued request can wait before throwing a timeout error */
  get maxDelay() {
    return this._quota.maxDelay || 0;
  }

  /** The effective rate of the limiter when the concurrency and lower bound rate are applied */
  get effectiveRate() {
    return this._effectiveRate;
  }

  /**
   * Log that an invocation started.
   * @returns true if the invocation was allowed, false if not (you can try again later)
   */
  start(queueWeight: number) {
    if (this._activeCount >= this._quota.concurrency) {
      return false;
    }

    if (this._quota.interval !== undefined && this.effectiveRate !== undefined) {
      this.removeExpiredHistory();

    if (queueWeight >= this.effectiveRate) {
        return false;
      }
      this.history.push(Date.now());
    }

    this._activeCount++;
    return true;
  }

  /** Log that an invocation ended */
  end() {
    this._activeCount--;
  }

  protected removeExpiredHistory() {
    const expired = Date.now() - this._quota.interval;
    while (this.history.length && this.history.peekFront() < expired) {
      this.history.shift();
    }
  }
}
