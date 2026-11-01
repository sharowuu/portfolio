// Vertical input is sampled even while a card is moving. A decaying trackpad tail
// remains one gesture; a new push, reversal, or sustained wheel can keep moving.
export class VerticalWheelIntent {
  private lastInput = -Infinity;
  private lastTrigger = -Infinity;
  private direction = 0;
  private total = 0;
  private peak = 0;
  private lastMagnitude = 0;
  private latched = false;

  consume(delta: number, now: number): -1 | 0 | 1 {
    const magnitude = Math.abs(delta);
    if (!Number.isFinite(delta) || !Number.isFinite(now) || magnitude === 0) return 0;
    const direction = Math.sign(delta);
    const gap = now - this.lastInput;
    const elapsed = now - this.lastTrigger;
    const reversed = this.direction !== 0 && direction !== this.direction;
    const fresh = gap >= 110 || reversed;
    const renewed = this.latched && elapsed >= 140 && magnitude >= 10 && magnitude > this.lastMagnitude * 1.6;
    const sustained = this.latched && elapsed >= 300 && magnitude >= 8 &&
      magnitude >= this.peak * .72 && magnitude >= this.lastMagnitude * .9;
    if (fresh || renewed || sustained) {
      this.total = 0;
      this.peak = magnitude;
      this.latched = false;
    }
    this.lastInput = now;
    this.lastMagnitude = magnitude;
    this.direction = direction;
    this.peak = Math.max(this.peak, magnitude);
    if (this.latched) return 0;
    this.total += magnitude;
    if (this.total < (reversed ? 8 : 12) || elapsed < (reversed ? 70 : 140)) return 0;
    this.latched = true;
    this.total = 0;
    this.lastTrigger = now;
    return direction > 0 ? 1 : -1;
  }
}
