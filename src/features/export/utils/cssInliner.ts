/**
 * CSS Inliner for Email Export
 *
 * Generates inline CSS styles for maximum email client compatibility.
 * Email clients have limited CSS support, so we convert all styles to inline.
 */

export interface StyleMap {
  [key: string]: string | number | undefined;
}

/**
 * Convert style object to inline CSS string
 */
export function generateInlineStyles(styles: StyleMap): string {
  return Object.entries(styles)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * Convert camelCase to kebab-case
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Merge multiple style maps
 */
export function mergeStyles(...styleMaps: StyleMap[]): StyleMap {
  return Object.assign({}, ...styleMaps);
}

/**
 * Email-safe font stack definitions
 */
export const EMAIL_SAFE_FONTS = {
  sansSerif: 'Arial, Helvetica, sans-serif',
  serif: 'Georgia, Times New Roman, serif',
  monospace: 'Courier New, Courier, monospace',
  system:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
} as const;

/**
 * Common email-compatible CSS resets
 */
export const EMAIL_RESET_STYLES: StyleMap = {
  margin: '0',
  padding: '0',
  border: '0',
  fontSize: '100%',
  font: 'inherit',
  verticalAlign: 'baseline',
};

/**
 * Generate responsive wrapper styles
 */
export function generateResponsiveWrapperStyles(maxWidth: number): StyleMap {
  return {
    width: '100%',
    maxWidth: `${maxWidth}px`,
    margin: '0 auto',
  };
}

/**
 * Generate table reset styles (for presentation tables)
 */
export function generateTableResetStyles(): StyleMap {
  return {
    borderCollapse: 'collapse',
    borderSpacing: '0',
    width: '100%',
  };
}

/**
 * Presets for common block styling
 */
export const BLOCK_PRESETS = {
  container: {
    width: '100%',
    tableLayout: 'fixed',
  },
  cell: {
    verticalAlign: 'top',
  },
  text: {
    wordBreak: 'break-word',
    wordWrap: 'break-word',
  },
  image: {
    display: 'block',
    border: '0',
    outline: 'none',
    textDecoration: 'none',
  },
  link: {
    textDecoration: 'none',
  },
} as const;

/**
 * Generate button hover-safe styles (inline only, no :hover support)
 */
export function generateButtonStyles(options: {
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  padding: string;
  borderRadius: number;
}): StyleMap {
  return {
    display: 'inline-block',
    backgroundColor: options.backgroundColor,
    color: options.textColor,
    fontSize: `${options.fontSize}px`,
    fontWeight: 'bold',
    padding: options.padding,
    borderRadius: `${options.borderRadius}px`,
    textDecoration: 'none',
    textAlign: 'center',
    msoHide: 'all', // Hide VML button in Outlook
  };
}
