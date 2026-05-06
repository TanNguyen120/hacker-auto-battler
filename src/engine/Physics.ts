export class Spring2D {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  targetX: number = 0;
  targetY: number = 0;

  // k = stiffness (pull strength), c = damping (friction/bounciness)
  constructor(public k: number = 180, public c: number = 14) {}

  update(dt: number) {
    // X Axis Physics
    const forceX = -this.k * (this.x - this.targetX);
    const dampingX = -this.c * this.vx;
    this.vx += (forceX + dampingX) * dt;
    this.x += this.vx * dt;

    // Y Axis Physics
    const forceY = -this.k * (this.y - this.targetY);
    const dampingY = -this.c * this.vy;
    this.vy += (forceY + dampingY) * dt;
    this.y += this.vy * dt;
  }
}
