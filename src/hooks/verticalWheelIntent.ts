// Sample every wheel event, including during navigation. Aily's continuous mode
// distinguishes renewed/live input from a decaying tail without requiring a pause.
export class VerticalWheelIntent {
  constructor(private continuous = false) {}
  private lastInput = -Infinity;
  private lastTrigger = -Infinity;
  private direction = 0;
  private total = 0;
  private peak = 0;
  private lastMagnitude = 0;
  private latched = false;
  private continuation = false;

  consume(delta: number, now: number, navigationReady = true): -1 | 0 | 1 {
    const magnitude = Math.abs(delta);
    if (!Number.isFinite(delta) || !Number.isFinite(now) || magnitude === 0) return 0;
    const direction = Math.sign(delta);
    const gap = now - this.lastInput;
    const elapsed = now - this.lastTrigger;
    const reversed = this.direction !== 0 && direction !== this.direction;
    const fresh = gap >= 110 || reversed;
    const renewed = this.latched && elapsed >= 140 && magnitude >= 10 &&
      magnitude > this.lastMagnitude * 1.6 && (!this.continuous || magnitude >= this.peak * .65);
    const sustained = this.latched && elapsed >= (this.continuous ? 400 : 300) && magnitude >= 8 &&
      magnitude >= this.peak * (this.continuous ? .8 : .72) && magnitude >= this.lastMagnitude * .9 &&
      (!this.continuous || navigationReady);
    if (fresh || renewed || sustained) {
      this.total = 0;
      this.peak = magnitude;
      this.latched = false;
      this.continuation = sustained;
    }
    this.lastInput = now;
    this.lastMagnitude = magnitude;
    this.direction = direction;
    this.peak = Math.max(this.peak, magnitude);
    if (this.latched) return 0;
    // A tentative continuation that has already decayed is momentum, not another push.
    if (this.continuous && !fresh && magnitude < this.peak * .6) {
      this.total = 0;
      this.latched = true;
      return 0;
    }
    this.total += magnitude;
    const threshold = this.continuous && this.continuation ? 200 : reversed ? 8 : 12;
    if (this.total < threshold || elapsed < (reversed ? 70 : 140)) return 0;
    // Same-direction input must still be live after arrival. Never queue wheel motion
    // for automatic execution onComplete; reversals can interrupt immediately.
    if (this.continuous && !navigationReady && !reversed) return 0;
    this.latched = true;
    this.total = 0;
    this.lastTrigger = now;
    return direction > 0 ? 1 : -1;
  }
}
