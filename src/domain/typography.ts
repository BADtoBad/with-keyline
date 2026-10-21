export const typographySpecs = {
  width: { label: ["Text width", "栏宽"], min: 320, max: 1600, step: 20, initial: 600, unit: "px", token: "text-max-width" },
  inset: { label: ["Side padding (−1 = auto)", "留白（−1 为自动）"], min: -1, max: 160, step: 1, initial: -1, unit: "px", token: "page-side-padding" },
  editorLeading: { label: ["Editor line height", "编辑行高"], min: 1.2, max: 2.2, step: .05, initial: 1.85, unit: "", token: "editor-line-height" },
  readingLeading: { label: ["Reading line height", "阅读行高"], min: 1.2, max: 2.2, step: .05, initial: 1.8, unit: "", token: "reading-line-height" },
  paragraphGap: { label: ["Line gap", "行间距"], min: 0, max: 1.5, step: .05, initial: 1, unit: "em", token: "paragraph-gap" },
  paragraphBefore: { label: ["Before paragraph", "段前"], min: 0, max: 2, step: .05, initial: 1, unit: "em", token: "paragraph-before" },
  paragraphAfter: { label: ["After paragraph", "段后"], min: 0, max: 2, step: .05, initial: 1, unit: "em", token: "paragraph-after" },
  firstIndent: { label: ["First-line indent", "首行缩进"], min: 0, max: 4, step: .25, initial: 0, unit: "em", token: "first-line-indent" },
  listLeading: { label: ["List line height", "列表行高"], min: 1.2, max: 2.2, step: .05, initial: 1.8, unit: "", token: "list-line-height" },
  listGap: { label: ["List item gap", "列表间距"], min: 0, max: .8, step: .02, initial: 0, unit: "em", token: "list-item-spacing" },
  listIndent: { label: ["List indent", "列表缩进"], min: .75, max: 3.5, step: .05, initial: 1.8, unit: "em", token: "list-indent" },
  markerGap: { label: ["Marker gap", "符号间距"], min: 4, max: 18, step: 1, initial: 10, unit: "px", token: "list-marker-gap" },
  bulletSize: { label: ["Bullet size", "圆点大小"], min: 3, max: 8, step: .5, initial: 7, unit: "px", token: "list-bullet-size" },
  quoteIndent: { label: ["Quote indent", "引用缩进"], min: 8, max: 32, step: 1, initial: 16, unit: "px", token: "blockquote-indent" },
  headingBefore: { label: ["Before heading", "标题段前"], min: .5, max: 3, step: .1, initial: 1.8, unit: "em", token: "heading-before" },
  headingAfter: { label: ["After heading", "标题段后"], min: 0, max: 1.5, step: .05, initial: .6, unit: "em", token: "heading-after" }
} as const;
export type TypographyKey = keyof typeof typographySpecs;
export type Typography = { [K in TypographyKey]: number };
export const typographyKeys = Object.keys(typographySpecs) as TypographyKey[];
export function normalizeTypography(value: unknown): Typography {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const result = {} as Typography;
  for (const key of typographyKeys) {
    const spec = typographySpecs[key], n = raw[key];
    const value = typeof n === "number" && Number.isFinite(n) ? n : spec.initial;
    const tick = Math.round((Math.min(spec.max, Math.max(spec.min, value)) - spec.min) / spec.step);
    result[key] = Number((spec.min + tick * spec.step).toFixed(4));
  }
  return result;
}
export function typographyVariables(values: Typography): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of typographyKeys) {
    const spec = typographySpecs[key];
    const value = key === "inset" ? values[key] < 0 ? "initial" : `min(${values[key]}px, 20cqw)` : `${values[key]}${spec.unit}`;
    // Existing Keyline theme tokens form a compatibility interface, not code.
    result[`--ncl-${spec.token}`] = value;
    result[`--keyline-next-${key}`] = value;
  }
  result["--file-line-width"] = `${values.width}px`;
  result["--list-indent"] = `${values.listIndent}em`;
  result["--list-spacing"] = `${values.listGap / 2}em`;
  result["--list-bullet-size"] = `${values.bulletSize}px`;
  result["--ncl-list-first-indent"] = `${Number(Math.max(.5, values.listIndent * .4).toFixed(2))}em`;
  return result;
}
