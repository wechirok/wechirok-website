export const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

export function approach(
  current: number,
  target: number,
  seconds: number,
  response = 0.24,
) {
  const next =
    current + (target - current) * (1 - Math.exp(-seconds / response));
  return Math.abs(next - target) < 0.0001 ? target : next;
}

export function createStars(count = 144, seed = 0x7b31e945) {
  let state = seed;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    z: random(),
    speed: 0.65 + random() * 0.7,
    radius: 0.85 + random() * 0.9,
    tone: ['lilac', 'rose', 'purple'][Math.floor(random() * 3)]!,
  }));
}

export type Star = ReturnType<typeof createStars>[number];

export const starLifetime = 1.8;

export function projectStar(
  star: Star,
  width: number,
  height: number,
  travel: number,
) {
  const depth = (((star.z - (travel * star.speed) / starLifetime) % 1) + 1) % 1;
  const scale = 1 / (0.45 + depth * 0.9);
  const smooth = (value: number) => {
    const x = Math.max(0, Math.min(1, value));
    return x * x * x * (x * (x * 6 - 15) + 10);
  };
  return {
    x: width * (0.5 + (star.x - 0.5) * scale),
    y: height * (0.5 + (star.y - 0.5) * scale),
    scale,
    opacity: smooth(depth / 0.18) * smooth((1 - depth) / 0.18),
  };
}

export function displacement(dx: number, dy: number, strength: number) {
  const distance = Math.hypot(dx, dy);
  if (distance >= 180) return { x: 0, y: 0 };
  const force =
    ((1 - distance / 180) ** 2 * 44 * strength) / Math.max(distance, 16);
  return { x: dx * force, y: dy * force };
}

export function advanceTravel(current: number, target: number, delta: number) {
  return current + clamp(target - current + clamp(delta, 240) * 0.0016, 0.9);
}
