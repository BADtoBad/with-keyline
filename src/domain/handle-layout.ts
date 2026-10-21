export interface HandleEdges { left: number; right: number; top: number; bottom: number }
type Layout = { x: number; y: number; size: number; side?: "right" };
/** A visual anchor is independent of the parsed block's operation range. Use
 * the text row, excluding layout gap widgets, and one fixed document gutter. */
export function handleLayout(viewport: HandleEdges, content: Pick<HandleEdges, "left" | "right">,
  row: Pick<HandleEdges, "top" | "bottom">, side: "left" | "right", count: number, nativeFold?: HandleEdges): Layout | null {
  if (![viewport.left, viewport.right, viewport.top, viewport.bottom, content.left, content.right, row.top, row.bottom, count].every(Number.isFinite) ||
    viewport.right - viewport.left < 100 || viewport.bottom - viewport.top < 30 || count < 1 || count > 3 || !Number.isInteger(count)) return null;
  const gutter = side === "left" ? content.left - viewport.left : viewport.right - content.right;
  const size = Math.max(20, Math.min(28, Math.floor((gutter - 10 - (count - 1) * 2) / count)));
  const width = size * count + (count - 1) * 2;
  const x = side === "left" ? Math.max(viewport.left + 6, content.left - width - 4)
    : Math.min(content.right + 4, viewport.right - width - 6);
  const y = (row.top + row.bottom - size) / 2;
  if (y < viewport.top || y + size > viewport.bottom) return null;
  // Native fold buttons extend into the gutter, even while transparent until
  // hover. Reserve their actual hitbox, not just the small visible chevron.
  if (side === "left" && nativeFold && Object.values(nativeFold).every(Number.isFinite) &&
    nativeFold.right > nativeFold.left && nativeFold.bottom > nativeFold.top &&
    y < nativeFold.bottom && y + size > nativeFold.top &&
    x < nativeFold.right && x + width + 4 > nativeFold.left) {
    const left = handleLayout(viewport, { left: Math.min(content.left, nativeFold.left), right: content.right }, row, side, count);
    if (left && left.x + left.size * count + (count - 1) * 2 + 4 <= nativeFold.left) return left;
    // Never shrink below the existing 20px minimum or cover the native button.
    // In a tight pane only this row uses the other side; preferences stay intact.
    const right = handleLayout(viewport, content, row, "right", count);
    return right && right.x >= Math.max(viewport.left + 6, nativeFold.right + 4)
      ? { ...right, side: "right" } : null;
  }
  return { x, y, size };
}
