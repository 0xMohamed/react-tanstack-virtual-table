/**
 * Measures text width using canvas for accurate measurement
 */
export function measureTextWidth(
  text: string,
  font: string = "14px arial, sans-serif"
): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;

  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

/**
 * Measures the maximum width needed for a column based on its content
 */
export function measureColumnWidth(
  headerText: string,
  cellValues: (string | number | null | undefined)[],
  options: {
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
    font?: string;
  } = {}
): number {
  const { minWidth = 50, maxWidth = 500, padding = 16, font = "14px arial, sans-serif" } = options;

  // Measure header text
  const headerWidth = measureTextWidth(String(headerText || ""), font);

  // Measure all cell values
  const cellWidths = cellValues.map((value) =>
    measureTextWidth(String(value || ""), font)
  );

  // Find the maximum width
  const maxContentWidth = Math.max(headerWidth, ...cellWidths);

  // Add padding and apply min/max constraints
  const totalWidth = maxContentWidth + padding;
  return Math.max(minWidth, Math.min(maxWidth, totalWidth));
}

/**
 * Creates a hidden measurement element for DOM-based measurement
 */
export function createMeasurementElement(): HTMLElement {
  const element = document.createElement("div");
  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.height = "auto";
  element.style.width = "auto";
  element.style.whiteSpace = "nowrap";
  element.style.padding = "0";
  element.style.margin = "0";
  element.style.border = "0";
  element.style.overflow = "hidden";
  document.body.appendChild(element);
  return element;
}

/**
 * Measures text width using DOM element (more accurate for styled text)
 */
export function measureTextWidthDOM(
  text: string,
  styles: Partial<CSSStyleDeclaration> = {}
): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const element = createMeasurementElement();
  
  // Apply styles
  Object.assign(element.style, {
    fontFamily: styles.fontFamily || "arial, sans-serif",
    fontSize: styles.fontSize || "14px",
    fontWeight: styles.fontWeight || "normal",
    fontStyle: styles.fontStyle || "normal",
    ...styles,
  });

  element.textContent = text;
  const width = element.offsetWidth;
  document.body.removeChild(element);
  return width;
}

