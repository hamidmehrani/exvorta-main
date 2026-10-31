/**
 * Pure TypeScript catalog builder, validator, and CSV parser for Exvorta RFQ catalogs.
 * Conforms to the catalog schema defined in `public/rfq-catalogs/example.json`.
 */

export interface Product {
  id: string;
  name: string;
  unit: string;
  moq: number;
  [key: string]: unknown;
}

export interface Catalog {
  slug: string;
  name: string;
  products: Product[];
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  row?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  catalog?: Catalog;
}

const SLUG_REGEX = /^[a-z0-9_-]+$/;
const PRODUCT_ID_REGEX = /^[a-z0-9_-]+$/i;

/**
 * Validates a raw catalog object strictly against the Exvorta RFQ catalog schema.
 */
export function validateCatalog(raw: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      valid: false,
      errors: [{ field: 'catalog', message: 'Catalog must be a valid JSON object' }],
    };
  }

  const rawObj = raw as Record<string, unknown>;

  // Validate slug: non-empty string, matches /^[a-z0-9_-]+$/
  if (typeof rawObj.slug !== 'string' || rawObj.slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: "Catalog 'slug' is required and must be a non-empty string",
    });
  } else if (!SLUG_REGEX.test(rawObj.slug.trim())) {
    errors.push({
      field: 'slug',
      message:
        "Catalog slug must contain only lowercase alphanumeric characters, dashes, and underscores",
    });
  }

  // Validate name: non-empty string trimmed
  if (typeof rawObj.name !== 'string' || rawObj.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: "Catalog 'name' is required and must be a non-empty string",
    });
  }

  // Validate products: array with at least 1 item
  if (!Array.isArray(rawObj.products)) {
    errors.push({
      field: 'products',
      message: "Catalog 'products' must be an array with at least 1 product",
    });
  } else if (rawObj.products.length === 0) {
    errors.push({
      field: 'products',
      message: "Catalog 'products' must contain at least 1 product",
    });
  } else {
    const seenIds = new Set<string>();

    rawObj.products.forEach((prod: unknown, index: number) => {
      const rowNum =
        typeof prod === 'object' && prod !== null && typeof (prod as Record<string, unknown>).row === 'number'
          ? ((prod as Record<string, unknown>).row as number)
          : undefined;

      const rowContext = rowNum !== undefined ? ` (row ${rowNum})` : '';

      if (!prod || typeof prod !== 'object' || Array.isArray(prod)) {
        errors.push({
          field: `products[${index}]`,
          message: `Product at index ${index}${rowContext} must be a valid object`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
        return;
      }

      const p = prod as Record<string, unknown>;

      // Validate product id
      if (typeof p.id !== 'string' || p.id.trim().length === 0) {
        errors.push({
          field: `products[${index}].id`,
          message: `Product at index ${index}${rowContext} is missing required field 'id'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      } else {
        const trimmedId = p.id.trim();
        if (!PRODUCT_ID_REGEX.test(trimmedId)) {
          errors.push({
            field: `products[${index}].id`,
            message: `Product id '${p.id}' at index ${index}${rowContext} contains invalid characters (allowed: alphanumeric, dashes, underscores)`,
            ...(rowNum !== undefined ? { row: rowNum } : {}),
          });
        } else {
          const lowerId = trimmedId.toLowerCase();
          if (seenIds.has(lowerId)) {
            errors.push({
              field: `products[${index}].id`,
              message: `Product id '${p.id}' is duplicated`,
              ...(rowNum !== undefined ? { row: rowNum } : {}),
            });
          } else {
            seenIds.add(lowerId);
          }
        }
      }

      // Validate product name
      if (typeof p.name !== 'string' || p.name.trim().length === 0) {
        errors.push({
          field: `products[${index}].name`,
          message: `Product at index ${index}${rowContext} is missing required field 'name'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      }

      // Validate product unit
      if (typeof p.unit !== 'string' || p.unit.trim().length === 0) {
        errors.push({
          field: `products[${index}].unit`,
          message: `Product at index ${index}${rowContext} is missing required field 'unit'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      }

      // Validate product moq: positive number (> 0), finite, not NaN
      if (
        typeof p.moq !== 'number' ||
        Number.isNaN(p.moq) ||
        !Number.isFinite(p.moq) ||
        p.moq <= 0
      ) {
        errors.push({
          field: `products[${index}].moq`,
          message: `Product at index ${index}${rowContext} field 'moq' must be a positive number (> 0)`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const cleanedProducts: Product[] = (rawObj.products as Array<Record<string, unknown>>).map((p) => ({
    ...p,
    id: (p.id as string).trim(),
    name: (p.name as string).trim(),
    unit: (p.unit as string).trim(),
    moq: p.moq as number,
  }));

  return {
    valid: true,
    errors: [],
    catalog: {
      ...rawObj,
      slug: (rawObj.slug as string).trim(),
      name: (rawObj.name as string).trim(),
      products: cleanedProducts,
    },
  };
}

/**
 * Raw CSV row parser that correctly handles quoted strings, escaped quotes, and CRLF / LF line breaks.
 */
export function parseRawCsv(csvContent: string): {
  rows: { rowNumber: number; cells: string[] }[];
  error?: string;
} {
  const rows: { rowNumber: number; cells: string[] }[] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let currentLineNumber = 1;
  let rowStartLine = 1;
  let i = 0;

  while (i < csvContent.length) {
    const char = csvContent[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < csvContent.length && csvContent[i + 1] === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Closing quote
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        if (char === '\n') {
          currentLineNumber++;
        }
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
        i++;
        continue;
      } else if (char === '\r') {
        if (i + 1 < csvContent.length && csvContent[i + 1] === '\n') {
          i++;
        }
        currentLineNumber++;
        currentRow.push(currentField);
        if (currentRow.some((c) => c.trim().length > 0)) {
          rows.push({ rowNumber: rowStartLine, cells: currentRow });
        }
        currentRow = [];
        currentField = '';
        rowStartLine = currentLineNumber;
        i++;
        continue;
      } else if (char === '\n') {
        currentLineNumber++;
        currentRow.push(currentField);
        if (currentRow.some((c) => c.trim().length > 0)) {
          rows.push({ rowNumber: rowStartLine, cells: currentRow });
        }
        currentRow = [];
        currentField = '';
        rowStartLine = currentLineNumber;
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (inQuotes) {
    return { rows: [], error: 'Malformed CSV: unclosed quote' };
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((c) => c.trim().length > 0)) {
      rows.push({ rowNumber: rowStartLine, cells: currentRow });
    }
  }

  return { rows };
}

const SLUG_ALIASES = ['slug', 'catalog_slug', 'catalogslug'];
const CATALOG_NAME_ALIASES = ['catalog_name', 'catalogname', 'catalog', 'catalog_title'];
const ID_ALIASES = ['id', 'product_id', 'productid', 'sku', 'code'];
const PRODUCT_NAME_ALIASES = ['product_name', 'productname', 'product', 'title'];
const UNIT_ALIASES = ['unit', 'uom', 'measure', 'unit_of_measure', 'unitofmeasure'];
const MOQ_ALIASES = [
  'moq',
  'min_order',
  'minorder',
  'minimum_order_quantity',
  'minimum_order',
  'min_order_qty',
  'min_order_quantity',
];

/**
 * Parses a CSV string into a validated Exvorta Catalog object.
 */
export function parseCsvCatalog(
  csvContent: string,
  options?: { slug?: string; name?: string }
): ValidationResult {
  if (!csvContent || csvContent.trim().length === 0) {
    return {
      valid: false,
      errors: [{ field: 'csv', message: 'CSV content is empty' }],
    };
  }

  const { rows, error } = parseRawCsv(csvContent);
  if (error) {
    return {
      valid: false,
      errors: [{ field: 'csv', message: error }],
    };
  }

  if (rows.length === 0) {
    return {
      valid: false,
      errors: [{ field: 'csv', message: 'CSV contains no data' }],
    };
  }

  const headerRow = rows[0];
  const rawHeaders = headerRow.cells.map((h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'));

  // Match columns
  let slugCol = -1;
  let catalogNameCol = -1;
  let idCol = -1;
  let productNameCol = -1;
  let unitCol = -1;
  let moqCol = -1;

  rawHeaders.forEach((h, idx) => {
    if (SLUG_ALIASES.includes(h) && slugCol === -1) slugCol = idx;
    else if (CATALOG_NAME_ALIASES.includes(h) && catalogNameCol === -1) catalogNameCol = idx;
    else if (ID_ALIASES.includes(h) && idCol === -1) idCol = idx;
    else if (PRODUCT_NAME_ALIASES.includes(h) && productNameCol === -1) productNameCol = idx;
    else if (UNIT_ALIASES.includes(h) && unitCol === -1) unitCol = idx;
    else if (MOQ_ALIASES.includes(h) && moqCol === -1) moqCol = idx;
  });

  // Handle generic 'name' column disambiguation
  rawHeaders.forEach((h, idx) => {
    if (h === 'name') {
      if (productNameCol === -1) {
        productNameCol = idx;
      } else if (catalogNameCol === -1) {
        catalogNameCol = idx;
      }
    }
  });

  const missingHeaders: string[] = [];
  if (idCol === -1) missingHeaders.push("'id' (or sku, code)");
  if (productNameCol === -1) missingHeaders.push("'name' (or product, title)");
  if (unitCol === -1) missingHeaders.push("'unit' (or uom, measure)");
  if (moqCol === -1) missingHeaders.push("'moq' (or min_order)");

  if (missingHeaders.length > 0) {
    return {
      valid: false,
      errors: [
        {
          field: 'headers',
          message: `CSV is missing required header column(s): ${missingHeaders.join(', ')}`,
          row: headerRow.rowNumber,
        },
      ],
    };
  }

  const dataRows = rows.slice(1);
  if (dataRows.length === 0) {
    return {
      valid: false,
      errors: [{ field: 'products', message: 'CSV does not contain any product rows', row: headerRow.rowNumber }],
    };
  }

  // Extract catalog slug & name from rows if present and not provided in options
  let extractedSlug = '';
  let extractedName = '';

  for (const row of dataRows) {
    if (slugCol !== -1 && !extractedSlug && row.cells[slugCol]?.trim()) {
      extractedSlug = row.cells[slugCol].trim();
    }
    if (catalogNameCol !== -1 && !extractedName && row.cells[catalogNameCol]?.trim()) {
      extractedName = row.cells[catalogNameCol].trim();
    }
  }

  const finalSlug = options?.slug?.trim() || extractedSlug || '';
  const finalName = options?.name?.trim() || extractedName || '';

  const maxExpectedCol = Math.max(idCol, productNameCol, unitCol, moqCol);
  const rowErrors: ValidationError[] = [];
  const products: Product[] = [];

  dataRows.forEach((row) => {
    if (row.cells.length <= maxExpectedCol) {
      // Check if all needed cells exist or if columns are truncated
      const hasMissingValues = [idCol, productNameCol, unitCol, moqCol].some(
        (colIdx) => row.cells[colIdx] === undefined
      );
      if (hasMissingValues) {
        rowErrors.push({
          field: `row[${row.rowNumber}]`,
          message: `Row ${row.rowNumber} is missing required columns`,
          row: row.rowNumber,
        });
      }
    }

    const id = row.cells[idCol]?.trim() ?? '';
    const name = row.cells[productNameCol]?.trim() ?? '';
    const unit = row.cells[unitCol]?.trim() ?? '';
    const rawMoq = row.cells[moqCol]?.trim() ?? '';
    const moq = rawMoq === '' ? NaN : Number(rawMoq);

    products.push({
      id,
      name,
      unit,
      moq,
      row: row.rowNumber,
    });
  });

  const rawCatalog = {
    slug: finalSlug,
    name: finalName,
    products,
  };

  const validation = validateCatalog(rawCatalog);
  if (!validation.valid || rowErrors.length > 0) {
    return {
      valid: false,
      errors: [...rowErrors, ...validation.errors],
    };
  }

  return validation;
}

/**
 * Serializes a validated Catalog object into formatted JSON matching `public/rfq-catalogs/example.json`.
 */
export function buildCatalogJson(catalog: Catalog, indent: number = 2): string {
  const output = {
    slug: catalog.slug,
    name: catalog.name,
    products: catalog.products.map((p) => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      moq: p.moq,
    })),
  };

  return JSON.stringify(output, null, indent) + '\n';
}
