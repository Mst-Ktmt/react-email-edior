/**
 * JSON Importer
 *
 * Imports JSON and validates against EmailDocument schema.
 */

import type { EmailDocument, GlobalStyles } from '@/types/document';
import type { Block, BlockType, SectionBlock } from '@/types/block';

/**
 * Import result with validation status
 */
export interface JsonImportResult {
  success: boolean;
  document: EmailDocument | null;
  errors: ValidationError[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  path: string;
  message: string;
  code: ValidationErrorCode;
}

/**
 * Error codes for validation
 */
export type ValidationErrorCode =
  | 'INVALID_JSON'
  | 'MISSING_FIELD'
  | 'INVALID_TYPE'
  | 'INVALID_VALUE'
  | 'INVALID_STRUCTURE';

/**
 * Valid block types
 */
const VALID_BLOCK_TYPES: BlockType[] = [
  'text',
  'image',
  'button',
  'divider',
  'section',
  'columns',
  'spacer',
  'html',
  'heading',
  'social',
  'menu',
  'video',
  'timer',
];

/**
 * Parse JSON string safely
 */
function parseJson(jsonString: string): { data: unknown; error: ValidationError | null } {
  try {
    const data = JSON.parse(jsonString);
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: {
        path: '',
        message: 'Invalid JSON format',
        code: 'INVALID_JSON',
      },
    };
  }
}

/**
 * Check if value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Validate GlobalStyles
 */
function validateGlobalStyles(
  styles: unknown,
  path: string
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!isObject(styles)) {
    errors.push({
      path,
      message: 'globalStyles must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  const requiredStringFields = ['fontFamily', 'backgroundColor', 'linkColor', 'textColor'];
  const requiredNumberFields = ['contentWidth', 'baseFontSize', 'baseLineHeight'];

  for (const field of requiredStringFields) {
    if (!isString(styles[field])) {
      errors.push({
        path: `${path}.${field}`,
        message: `${field} must be a string`,
        code: 'INVALID_TYPE',
      });
    }
  }

  for (const field of requiredNumberFields) {
    if (!isNumber(styles[field])) {
      errors.push({
        path: `${path}.${field}`,
        message: `${field} must be a number`,
        code: 'INVALID_TYPE',
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a single block
 */
function validateBlock(
  block: unknown,
  path: string
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!isObject(block)) {
    errors.push({
      path,
      message: 'Block must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  // Validate id
  if (!isString(block.id)) {
    errors.push({
      path: `${path}.id`,
      message: 'Block id must be a string',
      code: 'INVALID_TYPE',
    });
  }

  // Validate type
  if (!isString(block.type) || !VALID_BLOCK_TYPES.includes(block.type as BlockType)) {
    errors.push({
      path: `${path}.type`,
      message: `Block type must be one of: ${VALID_BLOCK_TYPES.join(', ')}`,
      code: 'INVALID_VALUE',
    });
  }

  // Validate props
  if (!isObject(block.props)) {
    errors.push({
      path: `${path}.props`,
      message: 'Block props must be an object',
      code: 'INVALID_TYPE',
    });
  }

  // Validate children for container blocks
  if (block.type === 'section' && 'children' in block) {
    if (!isArray(block.children)) {
      errors.push({
        path: `${path}.children`,
        message: 'Section children must be an array',
        code: 'INVALID_TYPE',
      });
    } else {
      (block.children as unknown[]).forEach((child, index) => {
        const childResult = validateBlock(child, `${path}.children[${index}]`);
        errors.push(...childResult.errors);
      });
    }
  }

  // Validate columns for columns blocks
  if (block.type === 'columns' && 'columns' in block) {
    if (!isArray(block.columns)) {
      errors.push({
        path: `${path}.columns`,
        message: 'Columns must be an array',
        code: 'INVALID_TYPE',
      });
    } else {
      (block.columns as unknown[]).forEach((column, colIndex) => {
        if (!isObject(column)) {
          errors.push({
            path: `${path}.columns[${colIndex}]`,
            message: 'Column must be an object',
            code: 'INVALID_TYPE',
          });
        } else {
          if (!isString(column.id)) {
            errors.push({
              path: `${path}.columns[${colIndex}].id`,
              message: 'Column id must be a string',
              code: 'INVALID_TYPE',
            });
          }
          if (!isArray(column.children)) {
            errors.push({
              path: `${path}.columns[${colIndex}].children`,
              message: 'Column children must be an array',
              code: 'INVALID_TYPE',
            });
          } else {
            (column.children as unknown[]).forEach((child, childIndex) => {
              const childResult = validateBlock(
                child,
                `${path}.columns[${colIndex}].children[${childIndex}]`
              );
              errors.push(...childResult.errors);
            });
          }
        }
      });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate EmailDocument structure
 */
function validateDocument(
  doc: unknown,
  path: string = 'document'
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!isObject(doc)) {
    errors.push({
      path,
      message: 'Document must be an object',
      code: 'INVALID_TYPE',
    });
    return { valid: false, errors };
  }

  // Required string fields
  const stringFields = ['id', 'name', 'createdAt', 'updatedAt'];
  for (const field of stringFields) {
    if (!isString(doc[field])) {
      errors.push({
        path: `${path}.${field}`,
        message: `${field} must be a string`,
        code: 'INVALID_TYPE',
      });
    }
  }

  // Validate version
  if (!isNumber(doc.version)) {
    errors.push({
      path: `${path}.version`,
      message: 'version must be a number',
      code: 'INVALID_TYPE',
    });
  }

  // Validate globalStyles
  const stylesResult = validateGlobalStyles(doc.globalStyles, `${path}.globalStyles`);
  errors.push(...stylesResult.errors);

  // Validate sections
  if (!isArray(doc.sections)) {
    errors.push({
      path: `${path}.sections`,
      message: 'sections must be an array',
      code: 'INVALID_TYPE',
    });
  } else {
    (doc.sections as unknown[]).forEach((section, index) => {
      const sectionResult = validateBlock(section, `${path}.sections[${index}]`);
      errors.push(...sectionResult.errors);

      // Sections must be of type 'section'
      if (isObject(section) && section.type !== 'section') {
        errors.push({
          path: `${path}.sections[${index}].type`,
          message: 'Root level blocks must be sections',
          code: 'INVALID_STRUCTURE',
        });
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Import JSON string to EmailDocument
 */
export function importFromJson(jsonString: string): JsonImportResult {
  // Parse JSON
  const { data, error: parseError } = parseJson(jsonString);

  if (parseError) {
    return {
      success: false,
      document: null,
      errors: [parseError],
    };
  }

  // Handle wrapped format (with exportedAt metadata)
  let documentData = data;
  if (isObject(data) && 'document' in data && 'exportVersion' in data) {
    documentData = data.document;
  }

  // Validate document structure
  const { valid, errors } = validateDocument(documentData);

  if (!valid) {
    return {
      success: false,
      document: null,
      errors,
    };
  }

  return {
    success: true,
    document: documentData as EmailDocument,
    errors: [],
  };
}

/**
 * Read file and import as EmailDocument
 */
export function importFromFile(file: File): Promise<JsonImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') {
        resolve({
          success: false,
          document: null,
          errors: [
            {
              path: '',
              message: 'Failed to read file content',
              code: 'INVALID_JSON',
            },
          ],
        });
        return;
      }

      resolve(importFromJson(content));
    };

    reader.onerror = () => {
      resolve({
        success: false,
        document: null,
        errors: [
          {
            path: '',
            message: 'Failed to read file',
            code: 'INVALID_JSON',
          },
        ],
      });
    };

    reader.readAsText(file);
  });
}
