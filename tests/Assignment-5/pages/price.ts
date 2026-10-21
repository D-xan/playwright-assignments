/** "Deal Price: ₹1,41,299" -> 141299 */
export function parsePrice(text: string): number {
  return Number(text.replace(/[^\d]/g, ''));
}
