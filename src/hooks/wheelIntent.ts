// Identify deliberate vertical wheel gestures without treating a decaying tail as a new swipe.
export class WheelIntent {
  private lastInput = -Infinity;
  private lastTrigger = -Infinity;
  private direction = 0;
  private total = 0;
  private latched = false;
  private lastMagnitude = 0;

  consume(delta: number, now: number): -1 | 0 | 1 {
    const magnitude = Math.abs(delta);
    if (!Number.isFinite(delta) || !Number.isFinite(now) || magnitude === 0) return 0;
    const direction = Math.sign(delta);
    const gap = now - this.lastInput;
    const sinceTrigger = now - this.lastTrigger;
    const reversed = this.direction !== 0 && direction !== this.direction;
    const renewedPeak = this.latched && sinceTrigger >= 260 &&
      magnitude >= 12 && magnitude > this.lastMagnitude * 1.6;
    // A brief pause or a renewed acceleration starts a fresh gesture.
    // A reversal is a fresh intention even while the previous card is animating.
    if (gap >= 110 || reversed || renewedPeak) {
      this.total = 0;
      this.latched = false;
    }
    this.lastInput = now;
    this.lastMagnitude = magnitude;
    this.direction = direction;
    if (this.latched) return 0;
    this.total += magnitude;
    const threshold = reversed ? 8 : 12;
    const cooldown = reversed ? 80 : 220;
    if (this.total < threshold || sinceTrigger < cooldown) return 0;
    this.latched = true;
    this.total = 0;
    this.lastTrigger = now;
    return direction > 0 ? 1 : -1;
  }
}
