#!/usr/bin/env node

/**
 * Exvorta RFQ Catalog Builder CLI
 *
 * Converts CSV and JSON product lists into validated Exvorta RFQ catalog JSON documents.
 * Usage: node scripts/build-rfq-catalog.mjs [options] [file]
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SLUG_REGEX = /^[a-z0-9_-]+$/;
const PRODUCT_ID_REGEX = /^[a-z0-9_-]+$/i;

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
 * Validates a catalog structure strictly against the Exvorta RFQ schema.
 */
export function validateCatalog(raw) {
  const errors = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      valid: false,
      errors: [{ field: 'catalog', message: 'Catalog must be a valid JSON object' }],
    };
  }

  // Validate slug: non-empty string, matches /^[a-z0-9_-]+$/
  if (typeof raw.slug !== 'string' || raw.slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: "Catalog 'slug' is required and must be a non-empty string",
    });
  } else if (!SLUG_REGEX.test(raw.slug.trim())) {
    errors.push({
      field: 'slug',
      message:
        'Catalog slug must contain only lowercase alphanumeric characters, dashes, and underscores',
    });
  }

  // Validate name: non-empty string trimmed
  if (typeof raw.name !== 'string' || raw.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: "Catalog 'name' is required and must be a non-empty string",
    });
  }

  // Validate products: array with at least 1 item
  if (!Array.isArray(raw.products)) {
    errors.push({
      field: 'products',
      message: "Catalog 'products' must be an array with at least 1 product",
    });
  } else if (raw.products.length === 0) {
    errors.push({
      field: 'products',
      message: "Catalog 'products' must contain at least 1 product",
    });
  } else {
    const seenIds = new Set();

    raw.products.forEach((prod, index) => {
      const rowNum =
        typeof prod === 'object' && prod !== null && typeof prod.row === 'number'
          ? prod.row
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

      // Validate product id
      if (typeof prod.id !== 'string' || prod.id.trim().length === 0) {
        errors.push({
          field: `products[${index}].id`,
          message: `Product at index ${index}${rowContext} is missing required field 'id'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      } else {
        const trimmedId = prod.id.trim();
        if (!PRODUCT_ID_REGEX.test(trimmedId)) {
          errors.push({
            field: `products[${index}].id`,
            message: `Product id '${prod.id}' at index ${index}${rowContext} contains invalid characters (allowed: alphanumeric, dashes, underscores)`,
            ...(rowNum !== undefined ? { row: rowNum } : {}),
          });
        } else {
          const lowerId = trimmedId.toLowerCase();
          if (seenIds.has(lowerId)) {
            errors.push({
              field: `products[${index}].id`,
              message: `Product id '${prod.id}' is duplicated`,
              ...(rowNum !== undefined ? { row: rowNum } : {}),
            });
          } else {
            seenIds.add(lowerId);
          }
        }
      }

      // Validate product name
      if (typeof prod.name !== 'string' || prod.name.trim().length === 0) {
        errors.push({
          field: `products[${index}].name`,
          message: `Product at index ${index}${rowContext} is missing required field 'name'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      }

      // Validate product unit
      if (typeof prod.unit !== 'string' || prod.unit.trim().length === 0) {
        errors.push({
          field: `products[${index}].unit`,
          message: `Product at index ${index}${rowContext} is missing required field 'unit'`,
          ...(rowNum !== undefined ? { row: rowNum } : {}),
        });
      }

      // Validate product moq: positive number (> 0), finite, not NaN
      if (
        typeof prod.moq !== 'number' ||
        Number.isNaN(prod.moq) ||
        !Number.isFinite(prod.moq) ||
        prod.moq <= 0
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

  const cleanedProducts = raw.products.map((p) => ({
    ...p,
    id: p.id.trim(),
    name: p.name.trim(),
    unit: p.unit.trim(),
    moq: p.moq,
  }));

  return {
    valid: true,
    errors: [],
    catalog: {
      ...raw,
      slug: raw.slug.trim(),
      name: raw.name.trim(),
      products: cleanedProducts,
    },
  };
}

/**
 * Raw CSV parser supporting quotes, commas, escaped quotes, CRLF and LF.
 */
export function parseRawCsv(csvContent) {
  const rows = [];
  let currentRow = [];
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
          currentField += '"';
          i += 2;
          continue;
        } else {
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

/**
 * Parses CSV content into a validated Catalog.
 */
export function parseCsvCatalog(csvContent, options) {
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

  rawHeaders.forEach((h, idx) => {
    if (h === 'name') {
      if (productNameCol === -1) {
        productNameCol = idx;
      } else if (catalogNameCol === -1) {
        catalogNameCol = idx;
      }
    }
  });

  const missingHeaders = [];
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
      errors: [
        {
          field: 'products',
          message: 'CSV does not contain any product rows',
          row: headerRow.rowNumber,
        },
      ],
    };
  }

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
  const rowErrors = [];
  const products = [];

  dataRows.forEach((row) => {
    if (row.cells.length <= maxExpectedCol) {
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
 * Builds formatted JSON string matching `public/rfq-catalogs/example.json`.
 */
export function buildCatalogJson(catalog, indent = 2) {
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

function printHelp() {
  console.log(`
Exvorta RFQ Catalog Builder CLI

Converts product CSV or JSON files into validated Exvorta RFQ catalog JSON documents.

Usage:
  node scripts/build-rfq-catalog.mjs [options] [file]

Options:
  -i, --input <path>     Input CSV or JSON file path
  -s, --slug <slug>      Catalog slug (default: derived from filename or input content)
  -n, --name <name>      Catalog display name (default: formatted slug or input content)
  -o, --out <path>       Output JSON file path (default: public/rfq-catalogs/<slug>.json)
  -c, --check            Validate only, do not write output file
  -h, --help             Display this help message and exit

Examples:
  node scripts/build-rfq-catalog.mjs --input products.csv --slug agro-export
  node scripts/build-rfq-catalog.mjs products.csv -s client-corp -n "Client Corp Catalog"
  node scripts/build-rfq-catalog.mjs client.json --check
  node scripts/build-rfq-catalog.mjs client.csv -o public/rfq-catalogs/client.json
`);
}

function formatSlugToName(slug) {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function parseCliArgs(argv) {
  const flags = {
    input: '',
    slug: '',
    name: '',
    out: '',
    check: false,
    help: false,
  };

  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '-h' || arg === '--help') {
      flags.help = true;
    } else if (arg === '-c' || arg === '--check') {
      flags.check = true;
    } else if (arg === '-i' || arg === '--input') {
      flags.input = argv[++i] || '';
    } else if (arg.startsWith('--input=')) {
      flags.input = arg.slice(8);
    } else if (arg === '-s' || arg === '--slug') {
      flags.slug = argv[++i] || '';
    } else if (arg.startsWith('--slug=')) {
      flags.slug = arg.slice(7);
    } else if (arg === '-n' || arg === '--name') {
      flags.name = argv[++i] || '';
    } else if (arg.startsWith('--name=')) {
      flags.name = arg.slice(7);
    } else if (arg === '-o' || arg === '--out') {
      flags.out = argv[++i] || '';
    } else if (arg.startsWith('--out=')) {
      flags.out = arg.slice(6);
    } else if (arg.startsWith('-')) {
      console.error(`Error: Unknown option '${arg}'. Use --help for usage information.`);
      process.exit(1);
    } else {
      positional.push(arg);
    }
  }

  if (!flags.input && positional.length > 0) {
    flags.input = positional[0];
  }

  return flags;
}

function main() {
  const flags = parseCliArgs(process.argv.slice(2));

  if (flags.help) {
    printHelp();
    process.exit(0);
  }

  if (!flags.input) {
    console.error('Error: Missing required input file. Use --input <path> or pass file as positional argument.');
    console.error('Run with --help for usage instructions.');
    process.exit(1);
  }

  const resolvedInputPath = path.resolve(process.cwd(), flags.input);
  if (!fs.existsSync(resolvedInputPath)) {
    console.error(`Error: Input file not found: ${flags.input}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(resolvedInputPath, 'utf8');
  const ext = path.extname(resolvedInputPath).toLowerCase();

  // Derive default slug from file base name if not supplied
  const baseFilename = path.basename(resolvedInputPath, path.extname(resolvedInputPath));
  const fallbackSlug = baseFilename
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let result;

  if (ext === '.csv') {
    result = parseCsvCatalog(rawContent, {
      slug: flags.slug || undefined,
      name: flags.name || undefined,
    });

    // If slug/name was missing in CSV and not in flags, try with fallbacks
    if (!result.valid && (!flags.slug || !flags.name)) {
      result = parseCsvCatalog(rawContent, {
        slug: flags.slug || fallbackSlug,
        name: flags.name || (fallbackSlug ? formatSlugToName(fallbackSlug) : undefined),
      });
    }
  } else if (ext === '.json') {
    let parsedJson;
    try {
      parsedJson = JSON.parse(rawContent);
    } catch (err) {
      console.error(`Error: Failed to parse JSON file '${flags.input}': ${err.message}`);
      process.exit(1);
    }

    if (parsedJson && typeof parsedJson === 'object' && !Array.isArray(parsedJson)) {
      if (flags.slug) parsedJson.slug = flags.slug;
      else if (!parsedJson.slug) parsedJson.slug = fallbackSlug;

      if (flags.name) parsedJson.name = flags.name;
      else if (!parsedJson.name && parsedJson.slug) parsedJson.name = formatSlugToName(parsedJson.slug);
    }

    result = validateCatalog(parsedJson);
  } else {
    // Attempt JSON first, then CSV
    let isJson = false;
    let parsedJson;
    try {
      parsedJson = JSON.parse(rawContent);
      isJson = true;
    } catch {
      isJson = false;
    }

    if (isJson && parsedJson && typeof parsedJson === 'object') {
      if (flags.slug) parsedJson.slug = flags.slug;
      if (flags.name) parsedJson.name = flags.name;
      result = validateCatalog(parsedJson);
    } else {
      result = parseCsvCatalog(rawContent, {
        slug: flags.slug || fallbackSlug,
        name: flags.name || (fallbackSlug ? formatSlugToName(fallbackSlug) : undefined),
      });
    }
  }

  if (!result.valid || !result.catalog) {
    console.error(`Validation failed with ${result.errors.length} error(s):`);
    result.errors.forEach((err) => {
      const rowInfo = err.row !== undefined ? ` [Row ${err.row}]` : '';
      console.error(`  - (${err.field})${rowInfo}: ${err.message}`);
    });
    process.exit(1);
  }

  const catalog = result.catalog;
  const outPath = flags.out
    ? path.resolve(process.cwd(), flags.out)
    : path.resolve(process.cwd(), 'public', 'rfq-catalogs', `${catalog.slug}.json`);

  const jsonString = buildCatalogJson(catalog);
  const byteSize = Buffer.byteLength(jsonString, 'utf8');

  if (flags.check) {
    console.log(
      `VALIDATION OK: Catalog "${catalog.name}" (${catalog.slug}) is valid with ${catalog.products.length} product(s). (Check mode, no file written)`
    );
    process.exit(0);
  }

  // Write output file
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, jsonString, 'utf8');

  const relativeOut = path.relative(process.cwd(), outPath);
  console.log('Catalog created successfully:');
  console.log(`  Name:     ${catalog.name}`);
  console.log(`  Slug:     ${catalog.slug}`);
  console.log(`  Products: ${catalog.products.length}`);
  console.log(`  Output:   ${relativeOut}`);
  console.log(`  Size:     ${byteSize} bytes`);

  process.exit(0);
}

// Only execute main if invoked as CLI script directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  main();
}
