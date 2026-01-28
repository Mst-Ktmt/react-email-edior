/**
 * HTML Generator for Email Export
 *
 * Converts block structure to email-compatible HTML using table layouts
 * for maximum email client compatibility.
 */

import type {
  Block,
  EmailDocument,
  SectionBlock,
  ColumnsBlock,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SpacerBlock,
  GlobalStyles,
} from '@/types';
import { isSectionBlock, isColumnsBlock } from '@/types';
import { generateInlineStyles } from './cssInliner';
import type { StyleMap } from './cssInliner';

/**
 * Generate complete email HTML from document
 */
export function generateEmailHtml(document: EmailDocument): string {
  const { sections, globalStyles } = document;

  const bodyContent = sections.map((section) => generateSectionHtml(section, globalStyles)).join('\n');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escapeHtml(document.name)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${globalStyles.backgroundColor}; font-family: ${globalStyles.fontFamily};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${globalStyles.backgroundColor};">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${globalStyles.contentWidth}" style="max-width: ${globalStyles.contentWidth}px;">
          ${bodyContent}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate HTML for a single block (recursive for containers)
 */
export function generateBlockHtml(block: Block, globalStyles: GlobalStyles): string {
  if (isSectionBlock(block)) {
    return generateSectionHtml(block, globalStyles);
  }
  if (isColumnsBlock(block)) {
    return generateColumnsHtml(block, globalStyles);
  }

  switch (block.type) {
    case 'text':
      return generateTextHtml(block as TextBlock, globalStyles);
    case 'image':
      return generateImageHtml(block as ImageBlock);
    case 'button':
      return generateButtonHtml(block as ButtonBlock, globalStyles);
    case 'divider':
      return generateDividerHtml(block as DividerBlock);
    case 'spacer':
      return generateSpacerHtml(block as SpacerBlock);
    default:
      return `<!-- Unknown block type: ${(block as Block).type} -->`;
  }
}

/**
 * Section block (container)
 */
function generateSectionHtml(block: SectionBlock, globalStyles: GlobalStyles): string {
  const { props, children } = block;
  const styles = generateInlineStyles({
    backgroundColor: props.backgroundColor || 'transparent',
    padding: formatPadding(props.padding),
    borderColor: props.borderWidth > 0 ? props.borderColor : undefined,
    borderWidth: props.borderWidth > 0 ? `${props.borderWidth}px` : undefined,
    borderStyle: props.borderWidth > 0 ? 'solid' : undefined,
    borderRadius: props.borderRadius > 0 ? `${props.borderRadius}px` : undefined,
  });

  const childrenHtml = children.map((child) => generateBlockHtml(child, globalStyles)).join('\n');

  return `<tr>
  <td style="${styles}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${childrenHtml}
    </table>
  </td>
</tr>`;
}

/**
 * Columns block (multi-column layout)
 */
function generateColumnsHtml(block: ColumnsBlock, globalStyles: GlobalStyles): string {
  const { props, columns } = block;
  const { columnWidths, gap, verticalAlign } = props;

  const columnsHtml = columns
    .map((column, index) => {
      const width = columnWidths[index] ?? Math.floor(100 / columns.length);
      const childrenHtml = column.children.map((child) => generateBlockHtml(child, globalStyles)).join('\n');
      const gapStyle = index < columns.length - 1 ? `padding-right: ${gap}px;` : '';

      return `<td width="${width}%" valign="${verticalAlign}" style="${gapStyle}">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${childrenHtml}
        </table>
      </td>`;
    })
    .join('\n');

  return `<tr>
  <td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        ${columnsHtml}
      </tr>
    </table>
  </td>
</tr>`;
}

/**
 * Text block
 */
function generateTextHtml(block: TextBlock, globalStyles: GlobalStyles): string {
  const { props } = block;
  const styles = generateInlineStyles({
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily || globalStyles.fontFamily,
    color: props.textColor || globalStyles.textColor,
    textAlign: props.textAlign,
    lineHeight: String(props.lineHeight),
    padding: formatPadding(props.padding),
    backgroundColor: props.backgroundColor || 'transparent',
  });

  return `<tr>
  <td style="${styles}">
    ${props.content}
  </td>
</tr>`;
}

/**
 * Image block
 */
function generateImageHtml(block: ImageBlock): string {
  const { props } = block;
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const imgStyles = generateInlineStyles({
    display: 'block',
    maxWidth: '100%',
    width,
    borderRadius: props.borderRadius > 0 ? `${props.borderRadius}px` : undefined,
  });
  const tdStyles = generateInlineStyles({
    textAlign: props.align,
    padding: formatPadding(props.padding),
  });

  const img = `<img src="${escapeHtml(props.src)}" alt="${escapeHtml(props.alt)}" style="${imgStyles}" />`;
  const content = props.linkUrl ? `<a href="${escapeHtml(props.linkUrl)}" target="_blank">${img}</a>` : img;

  return `<tr>
  <td style="${tdStyles}">
    ${content}
  </td>
</tr>`;
}

/**
 * Button block
 */
function generateButtonHtml(block: ButtonBlock, globalStyles: GlobalStyles): string {
  const { props } = block;
  const buttonWidth = props.width === 'full' ? '100%' : props.width === 'auto' ? 'auto' : `${props.width}px`;

  const buttonStyles = generateInlineStyles({
    display: 'inline-block',
    backgroundColor: props.backgroundColor || globalStyles.linkColor,
    color: props.textColor,
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily || globalStyles.fontFamily,
    padding: formatPadding(props.padding),
    borderRadius: `${props.borderRadius}px`,
    textDecoration: 'none',
    textAlign: 'center',
    width: buttonWidth,
  });

  const tdStyles = generateInlineStyles({
    textAlign: props.align,
    padding: '10px 0',
  });

  return `<tr>
  <td style="${tdStyles}">
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(props.linkUrl)}" style="height:auto;v-text-anchor:middle;width:${buttonWidth};" arcsize="10%" strokecolor="${props.backgroundColor || globalStyles.linkColor}" fillcolor="${props.backgroundColor || globalStyles.linkColor}">
      <w:anchorlock/>
      <center style="color:${props.textColor};font-family:${props.fontFamily || globalStyles.fontFamily};font-size:${props.fontSize}px;">
        ${escapeHtml(props.text)}
      </center>
    </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-->
    <a href="${escapeHtml(props.linkUrl)}" target="_blank" style="${buttonStyles}">
      ${escapeHtml(props.text)}
    </a>
    <!--<![endif]-->
  </td>
</tr>`;
}

/**
 * Divider block
 */
function generateDividerHtml(block: DividerBlock): string {
  const { props } = block;
  const width = typeof props.width === 'number' ? `${props.width}%` : props.width;
  const hrStyles = generateInlineStyles({
    border: 'none',
    borderTop: `${props.thickness}px ${props.style} ${props.color}`,
    margin: '0',
    width,
  });

  return `<tr>
  <td style="${generateInlineStyles({ padding: formatPadding(props.padding) })}">
    <hr style="${hrStyles}" />
  </td>
</tr>`;
}

/**
 * Spacer block
 */
function generateSpacerHtml(block: SpacerBlock): string {
  const { props } = block;
  const height = props.height;

  return `<tr>
  <td style="height: ${height}px; line-height: ${height}px; font-size: 1px;">
    &nbsp;
  </td>
</tr>`;
}

/**
 * Format padding object to CSS string
 */
function formatPadding(padding: { top: number; right: number; bottom: number; left: number }): string {
  return `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
}

/**
 * Escape HTML entities
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
