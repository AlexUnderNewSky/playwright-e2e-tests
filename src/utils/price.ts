export function parsePrice(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) {
    throw new Error(`Cannot parse price from "${text}"`);
  }
  return Number(match[1]);
}

export function sum(values: number[]): number {
  return Math.round(values.reduce((acc, value) => acc + value, 0) * 100) / 100;
}
