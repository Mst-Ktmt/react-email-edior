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
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  ButtonBlockProps,
  DividerBlock,
  SpacerBlock,
  VideoBlock,
  TimerBlock,
  GlobalStyles,
} from '@/types';
import { isSectionBlock, isColumnsBlock } from '@/types';
import { generateInlineStyles } from './cssInliner';
import type { StyleMap } from './cssInliner';
import { buildTrackingUrl } from './buildTrackingUrl';

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

  <!-- Responsive Styles -->
  <!--[if !mso]><!-->
  <style>
    @media only screen and (min-width: 768px) {
      .hide-on-desktop {
        display: none !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
    }
    @media only screen and (max-width: 767px) {
      .hide-on-mobile {
        display: none !important;
        max-height: 0 !important;
        overflow: hidden !important;
      }
    }
  </style>
  <!--<![endif]-->

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
    case 'heading':
      return generateHeadingHtml(block as HeadingBlock, globalStyles);
    case 'image':
      return generateImageHtml(block as ImageBlock);
    case 'button':
      return generateButtonHtml(block as ButtonBlock, globalStyles);
    case 'divider':
      return generateDividerHtml(block as DividerBlock);
    case 'spacer':
      return generateSpacerHtml(block as SpacerBlock);
    case 'video':
      return generateVideoHtml(block as VideoBlock);
    case 'timer':
      return generateTimerHtml(block as TimerBlock);
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
 * Heading block
 */
function generateHeadingHtml(block: HeadingBlock, globalStyles: GlobalStyles): string {
  const { props } = block;

  const styles = generateInlineStyles({
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily || globalStyles.fontFamily,
    fontWeight: props.fontWeight ?? '700',
    color: props.textColor || globalStyles.textColor,
    textAlign: props.textAlign,
    lineHeight: String(props.lineHeight ?? 1.2),
    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
    padding: formatPadding(props.padding),
    backgroundColor: props.backgroundColor || 'transparent',
    margin: '0',
  });

  const marginStyle = props.marginBottom ? `margin-bottom: ${props.marginBottom}px;` : '';

  return `<tr${getResponsiveClasses(props)}>
  <td style="${marginStyle}">
    <h${props.level} style="${styles}">
      ${props.content}
    </h${props.level}>
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
    fontWeight: props.fontWeight,
    color: props.textColor || globalStyles.textColor,
    textAlign: props.textAlign,
    lineHeight: String(props.lineHeight),
    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
    padding: formatPadding(props.padding),
    backgroundColor: props.backgroundColor || 'transparent',
  });

  return `<tr${getResponsiveClasses(props)}>
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

  return `<tr${getResponsiveClasses(props)}>
  <td style="${tdStyles}">
    ${content}
  </td>
</tr>`;
}

/**
 * Generate icon HTML
 */
function generateIconHtml(icon: ButtonBlockProps['icon'], textColor: string): string {
  if (!icon) return '';

  if (icon.type === 'emoji' || icon.type === 'unicode') {
    // Emoji or Unicode character
    return `<span style="display: inline-block; vertical-align: middle;">${escapeHtml(icon.content)}</span>`;
  }

  // SVG
  const svgColor = icon.color || textColor;
  const svgSize = icon.size || 16;
  return `<span style="display: inline-block; vertical-align: middle;"><svg width="${svgSize}" height="${svgSize}" fill="${svgColor}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${icon.content}</svg></span>`;
}

/**
 * Generate button content with icon
 */
function generateButtonContent(text: string, icon: ButtonBlockProps['icon'], textColor: string): string {
  if (!icon) {
    return escapeHtml(text);
  }

  const iconHtml = generateIconHtml(icon, textColor);
  const textSpan = `<span style="display: inline-block; vertical-align: middle;">${escapeHtml(text)}</span>`;
  const spacingStyle = `display: inline-block; width: ${icon.spacing}px;`;

  if (icon.position === 'left') {
    return `${iconHtml}<span style="${spacingStyle}"></span>${textSpan}`;
  }
  return `${textSpan}<span style="${spacingStyle}"></span>${iconHtml}`;
}

/**
 * Button block
 */
function generateButtonHtml(block: ButtonBlock, globalStyles: GlobalStyles): string {
  const { props } = block;
  const buttonWidth = props.width === 'full' ? '100%' : props.width === 'auto' ? 'auto' : `${props.width}px`;
  const buttonId = `button-${block.id}`;

  // Generate Box Shadow CSS
  const boxShadowCss = props.boxShadow
    ? `${props.boxShadow.inset ? 'inset ' : ''}${props.boxShadow.x}px ${props.boxShadow.y}px ${props.boxShadow.blur}px ${props.boxShadow.spread}px ${props.boxShadow.color}`
    : undefined;

  // Generate Background CSS (Solid or Gradient)
  const backgroundCss = props.backgroundGradient
    ? props.backgroundGradient.type === 'linear'
      ? `linear-gradient(${props.backgroundGradient.angle || 90}deg, ${props.backgroundGradient.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`
      : `radial-gradient(circle, ${props.backgroundGradient.colors.map((c) => `${c.color} ${c.position}%`).join(', ')})`
    : undefined;

  // Base button styles
  const buttonStyles = generateInlineStyles({
    display: 'inline-block',
    backgroundColor: !props.backgroundGradient ? props.backgroundColor || globalStyles.linkColor : undefined,
    background: backgroundCss,
    color: props.textColor,
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily || globalStyles.fontFamily,
    fontWeight: props.fontWeight,
    lineHeight: props.lineHeight ? String(props.lineHeight) : undefined,
    letterSpacing: props.letterSpacing ? `${props.letterSpacing}px` : undefined,
    padding: formatPadding(props.padding),
    borderRadius: `${props.borderRadius}px`,
    textDecoration: 'none',
    textAlign: 'center',
    width: buttonWidth,
    minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
    maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
    // Border
    border:
      props.borderWidth && props.borderWidth > 0
        ? `${props.borderWidth}px ${props.borderStyle || 'solid'} ${props.borderColor || '#000000'}`
        : undefined,
    // Box Shadow
    boxShadow: boxShadowCss,
  });

  // Container styles (opacity applied here for Outlook compatibility)
  const containerOpacity = props.opacity !== undefined ? props.opacity : 1.0;
  const tdStyles = generateInlineStyles({
    textAlign: props.align,
    padding: '10px 0',
    opacity: containerOpacity < 1.0 ? String(containerOpacity) : undefined,
  });

  // Generate hover style CSS
  const hoverStyleCss = props.hoverStyle
    ? `
    <style>
      .${buttonId}:hover {
        ${props.hoverStyle.backgroundColor ? `background-color: ${props.hoverStyle.backgroundColor} !important;` : ''}
        ${props.hoverStyle.textColor ? `color: ${props.hoverStyle.textColor} !important;` : ''}
        ${props.hoverStyle.borderColor ? `border-color: ${props.hoverStyle.borderColor} !important;` : ''}
        ${props.hoverStyle.opacity !== undefined ? `opacity: ${props.hoverStyle.opacity};` : ''}
      }
    </style>`
    : '';

  // Generate button content with icon
  const buttonContent = generateButtonContent(props.text, props.icon, props.textColor);

  // VML content for Outlook (emoji/unicode only, SVG not supported)
  const vmlContent =
    props.icon && (props.icon.type === 'emoji' || props.icon.type === 'unicode')
      ? props.icon.position === 'left'
        ? `${props.icon.content} ${escapeHtml(props.text)}`
        : `${escapeHtml(props.text)} ${props.icon.content}`
      : escapeHtml(props.text);

  // Generate VML for Outlook (with basic styles only)
  const vmlArcsize = props.borderRadius > 0 ? Math.min(Math.round((props.borderRadius / 50) * 100), 100) : 0;

  // Build final URL with tracking parameters
  const finalUrl = buildTrackingUrl(props.linkUrl, props.tracking);

  return `${hoverStyleCss}<tr${getResponsiveClasses(props)}>
  <td style="${tdStyles}">
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeHtml(finalUrl)}" style="height:auto;v-text-anchor:middle;width:${buttonWidth};" arcsize="${vmlArcsize}%" ${props.borderWidth && props.borderWidth > 0 ? `stroke="t" strokecolor="${props.borderColor || '#000000'}" strokeweight="${props.borderWidth}px"` : 'stroke="f"'} fillcolor="${props.backgroundColor || globalStyles.linkColor}">
      <w:anchorlock/>
      <center style="color:${props.textColor};font-family:${props.fontFamily || globalStyles.fontFamily};font-size:${props.fontSize}px;${props.fontWeight ? `font-weight:${props.fontWeight};` : ''}">
        ${vmlContent}
      </center>
    </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-->
    <a href="${escapeHtml(finalUrl)}" target="${props.linkTarget || '_blank'}" class="${buttonId}" style="${buttonStyles}">
      ${buttonContent}
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

  return `<tr${getResponsiveClasses(props)}>
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

  return `<tr${getResponsiveClasses(props)}>
  <td style="height: ${height}px; line-height: ${height}px; font-size: 1px;">
    &nbsp;
  </td>
</tr>`;
}

/**
 * Video block - thumbnail with play button overlay and link
 */
function generateVideoHtml(block: VideoBlock): string {
  const { props } = block;
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width;

  const tdStyles = generateInlineStyles({
    textAlign: props.align,
    padding: formatPadding(props.padding),
  });

  const imgStyles = generateInlineStyles({
    display: 'block',
    maxWidth: '100%',
    width,
    borderRadius: props.borderRadius > 0 ? `${props.borderRadius}px` : undefined,
  });

  // If no thumbnail, show placeholder text
  if (!props.thumbnailSrc) {
    return `<tr>
  <td style="${tdStyles}">
    <div style="background-color: #e5e7eb; padding: 40px; text-align: center; color: #9ca3af; border-radius: ${props.borderRadius}px;">
      Video Thumbnail
    </div>
  </td>
</tr>`;
  }

  const img = `<img src="${escapeHtml(props.thumbnailSrc)}" alt="${escapeHtml(props.alt)}" style="${imgStyles}" />`;
  const content = props.videoUrl
    ? `<a href="${escapeHtml(props.videoUrl)}" target="_blank" style="display: block; position: relative;">
        ${img}
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; background-color: ${props.playButtonColor}CC; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <div style="width: 0; height: 0; border-left: 20px solid white; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 4px;"></div>
        </div>
      </a>`
    : img;

  return `<tr${getResponsiveClasses(props)}>
  <td style="${tdStyles}">
    ${content}
  </td>
</tr>`;
}

/**
 * Timer block - static countdown display
 * Note: Real-time countdown requires JavaScript which is not supported in most email clients.
 * This generates a static representation of the countdown.
 */
function generateTimerHtml(block: TimerBlock): string {
  const { props } = block;

  const tdStyles = generateInlineStyles({
    textAlign: 'center',
    padding: formatPadding(props.padding),
    backgroundColor: props.backgroundColor === 'transparent' ? undefined : props.backgroundColor,
  });

  const textStyles = generateInlineStyles({
    fontSize: `${props.fontSize}px`,
    color: props.textColor,
    fontWeight: 'bold',
  });

  const labelStyles = generateInlineStyles({
    fontSize: `${Math.max(props.fontSize * 0.5, 10)}px`,
    color: props.textColor,
    opacity: '0.7',
  });

  // Calculate time remaining at export time
  const end = new Date(props.endDate).getTime();
  const now = Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return `<tr>
  <td style="${tdStyles}">
    <span style="${textStyles}">${escapeHtml(props.expiredMessage)}</span>
  </td>
</tr>`;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  const parts: string[] = [];
  if (props.showDays) parts.push(`<td style="text-align: center; padding: 0 8px;"><span style="${textStyles}">${formatNum(days)}</span><br/><span style="${labelStyles}">Days</span></td>`);
  if (props.showHours) parts.push(`<td style="text-align: center; padding: 0 8px;"><span style="${textStyles}">${formatNum(hours)}</span><br/><span style="${labelStyles}">Hours</span></td>`);
  if (props.showMinutes) parts.push(`<td style="text-align: center; padding: 0 8px;"><span style="${textStyles}">${formatNum(minutes)}</span><br/><span style="${labelStyles}">Minutes</span></td>`);
  if (props.showSeconds) parts.push(`<td style="text-align: center; padding: 0 8px;"><span style="${textStyles}">${formatNum(seconds)}</span><br/><span style="${labelStyles}">Seconds</span></td>`);

  const separatorStyle = `style="${textStyles}"`;
  const separators = parts.map((_, i) => i < parts.length - 1 ? `<td ${separatorStyle}>:</td>` : '').filter(Boolean);

  // Interleave parts with separators
  const cells: string[] = [];
  parts.forEach((part, i) => {
    cells.push(part);
    if (separators[i]) cells.push(separators[i]);
  });

  return `<tr>
  <td style="${tdStyles}">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        ${cells.join('\n        ')}
      </tr>
    </table>
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
 * Generate responsive class names from block props
 */
function getResponsiveClasses(props: { hideOnDesktop?: boolean; hideOnMobile?: boolean }): string {
  const classes: string[] = [];
  if (props.hideOnDesktop) classes.push('hide-on-desktop');
  if (props.hideOnMobile) classes.push('hide-on-mobile');
  return classes.length > 0 ? ` class="${classes.join(' ')}"` : '';
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
