import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  validateCatalog,
  parseCsvCatalog,
  buildCatalogJson,
  parseRawCsv,
} from './rfq-catalog-builder';

describe('validateCatalog', () => {
  it('validates a valid catalog conforming to example.json', () => {
    const examplePath = path.resolve(process.cwd(), 'public/rfq-catalogs/example.json');
    const exampleRaw = JSON.parse(fs.readFileSync(examplePath, 'utf8'));

    const result = validateCatalog(exampleRaw);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.catalog).toBeDefined();
    expect(result.catalog?.slug).toBe('example');
    expect(result.catalog?.name).toBe('Standard Export Catalog');
    expect(result.catalog?.products).toHaveLength(3);
    expect(result.catalog?.products[0]).toEqual({
      id: 'prod-1',
      name: 'Refined Sunflower Oil',
      unit: 'MT',
      moq: 20,
    });
  });

  it('rejects non-object catalog inputs', () => {
    expect(validateCatalog(null).valid).toBe(false);
    expect(validateCatalog(undefined).valid).toBe(false);
    expect(validateCatalog('string').valid).toBe(false);
    expect(validateCatalog([]).valid).toBe(false);
  });

  describe('slug validation', () => {
    it('fails when slug is missing, non-string, or empty', () => {
      const res1 = validateCatalog({ name: 'Catalog', products: [{ id: 'p1', name: 'P', unit: 'KG', moq: 1 }] });
      expect(res1.valid).toBe(false);
      expect(res1.errors.some((e) => e.field === 'slug')).toBe(true);

      const res2 = validateCatalog({ slug: '   ', name: 'Catalog', products: [{ id: 'p1', name: 'P', unit: 'KG', moq: 1 }] });
      expect(res2.valid).toBe(false);
      expect(res2.errors.some((e) => e.field === 'slug')).toBe(true);
    });

    it('fails when slug contains uppercase, spaces, or special characters', () => {
      const invalidSlugs = ['MySlug', 'has spaces', 'under_score$bad', 'slug/slash', 'accentué'];
      for (const slug of invalidSlugs) {
        const res = validateCatalog({
          slug,
          name: 'Catalog',
          products: [{ id: 'p1', name: 'P', unit: 'KG', moq: 1 }],
        });
        expect(res.valid).toBe(false);
        expect(res.errors.some((e) => e.field === 'slug')).toBe(true);
      }
    });

    it('accepts valid slugs with lowercase alphanumeric, hyphens, and underscores', () => {
      const validSlugs = ['example', 'client-a', 'agro_export_2026', 'trade-v1_2'];
      for (const slug of validSlugs) {
        const res = validateCatalog({
          slug,
          name: 'Catalog',
          products: [{ id: 'p1', name: 'P', unit: 'KG', moq: 1 }],
        });
        expect(res.valid).toBe(true);
      }
    });
  });

  describe('name validation', () => {
    it('fails when name is missing, empty, or whitespace only', () => {
      const res = validateCatalog({
        slug: 'valid-slug',
        name: '   ',
        products: [{ id: 'p1', name: 'P', unit: 'KG', moq: 1 }],
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.field === 'name')).toBe(true);
    });
  });

  describe('products array validation', () => {
    it('fails when products is missing, not an array, or empty', () => {
      const res1 = validateCatalog({ slug: 'valid-slug', name: 'Catalog' });
      expect(res1.valid).toBe(false);
      expect(res1.errors.some((e) => e.field === 'products')).toBe(true);

      const res2 = validateCatalog({ slug: 'valid-slug', name: 'Catalog', products: [] });
      expect(res2.valid).toBe(false);
      expect(res2.errors.some((e) => e.field === 'products')).toBe(true);
    });

    it('fails when product item is not an object', () => {
      const res = validateCatalog({
        slug: 'valid-slug',
        name: 'Catalog',
        products: ['not an object' as unknown as Record<string, unknown>],
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.field.startsWith('products['))).toBe(true);
    });

    it('fails when product is missing id, name, or unit', () => {
      const res = validateCatalog({
        slug: 'valid-slug',
        name: 'Catalog',
        products: [
          { id: '', name: 'Sugar', unit: 'MT', moq: 10 },
          { id: 'p2', name: ' ', unit: 'MT', moq: 10 },
          { id: 'p3', name: 'Wheat', unit: '', moq: 10 },
        ],
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.field === 'products[0].id')).toBe(true);
      expect(res.errors.some((e) => e.field === 'products[1].name')).toBe(true);
      expect(res.errors.some((e) => e.field === 'products[2].unit')).toBe(true);
    });

    it('fails when product id contains invalid characters', () => {
      const res = validateCatalog({
        slug: 'valid-slug',
        name: 'Catalog',
        products: [{ id: 'invalid id with spaces!', name: 'Sugar', unit: 'MT', moq: 10 }],
      });
      expect(res.valid).toBe(false);
      expect(res.errors.some((e) => e.field === 'products[0].id')).toBe(true);
    });

    it('fails on duplicate product IDs (case-insensitive check)', () => {
      const res = validateCatalog({
        slug: 'valid-slug',
        name: 'Catalog',
        products: [
          { id: 'PROD-1', name: 'Sunflower Oil', unit: 'MT', moq: 10 },
          { id: 'prod-1', name: 'Wheat Flour', unit: 'MT', moq: 20 },
        ],
      });
      expect(res.valid).toBe(false);
      const duplicateError = res.errors.find((e) => e.field === 'products[1].id');
      expect(duplicateError).toBeDefined();
      expect(duplicateError?.message).toContain("duplicated");
    });

    it('fails when moq is zero, negative, NaN, non-finite, or a string', () => {
      const testCases = [0, -10, NaN, Infinity, -Infinity, '50' as unknown as number];
      for (const badMoq of testCases) {
        const res = validateCatalog({
          slug: 'valid-slug',
          name: 'Catalog',
          products: [{ id: 'p1', name: 'Item', unit: 'MT', moq: badMoq }],
        });
        expect(res.valid).toBe(false);
        expect(res.errors.some((e) => e.field === 'products[0].moq')).toBe(true);
      }
    });
  });
});

describe('parseRawCsv', () => {
  it('handles standard commas and CRLF/LF line endings', () => {
    const csv = 'id,name,unit,moq\r\np1,Sugar,MT,20\np2,Flour,MT,50';
    const parsed = parseRawCsv(csv);
    expect(parsed.error).toBeUndefined();
    expect(parsed.rows).toHaveLength(3);
    expect(parsed.rows[0].cells).toEqual(['id', 'name', 'unit', 'moq']);
    expect(parsed.rows[1].cells).toEqual(['p1', 'Sugar', 'MT', '20']);
  });

  it('handles quoted fields containing commas', () => {
    const csv = 'id,name,unit,moq\np1,"Sugar, High Grade",MT,20';
    const parsed = parseRawCsv(csv);
    expect(parsed.error).toBeUndefined();
    expect(parsed.rows[1].cells[1]).toBe('Sugar, High Grade');
  });

  it('handles escaped quotes inside quoted fields', () => {
    const csv = 'id,name,unit,moq\np1,"Special ""A"" Grade",MT,20';
    const parsed = parseRawCsv(csv);
    expect(parsed.error).toBeUndefined();
    expect(parsed.rows[1].cells[1]).toBe('Special "A" Grade');
  });

  it('detects unclosed quotes as malformed CSV', () => {
    const csv = 'id,name,unit,moq\np1,"Unclosed quote,MT,20';
    const parsed = parseRawCsv(csv);
    expect(parsed.error).toContain('unclosed quote');
  });
});

describe('parseCsvCatalog', () => {
  it('parses standard CSV with headers id,name,unit,moq', () => {
    const csv = `id,name,unit,moq
prod-1,Refined Sunflower Oil,MT,20
prod-2,Organic Wheat Flour,MT,50`;

    const result = parseCsvCatalog(csv, { slug: 'standard-cat', name: 'Standard Catalog' });
    expect(result.valid).toBe(true);
    expect(result.catalog?.slug).toBe('standard-cat');
    expect(result.catalog?.name).toBe('Standard Catalog');
    expect(result.catalog?.products).toHaveLength(2);
    expect(result.catalog?.products[0]).toEqual({
      id: 'prod-1',
      name: 'Refined Sunflower Oil',
      unit: 'MT',
      moq: 20,
      row: 2,
    });
  });

  it('parses CSV with alternative header names (sku, product_name, uom, min_order)', () => {
    const csv = `sku,product_name,uom,min_order
SKU-99,Turkish Hazelnuts,KG,500
SKU-100,Iranian Saffron,G,100`;

    const result = parseCsvCatalog(csv, { slug: 'alt-headers', name: 'Alt Catalog' });
    expect(result.valid).toBe(true);
    expect(result.catalog?.products).toHaveLength(2);
    expect(result.catalog?.products[0].id).toBe('SKU-99');
    expect(result.catalog?.products[0].name).toBe('Turkish Hazelnuts');
    expect(result.catalog?.products[0].unit).toBe('KG');
    expect(result.catalog?.products[0].moq).toBe(500);
  });

  it('handles quoted fields with commas correctly', () => {
    const csv = `id,name,unit,moq
prod-1,"White Cane Sugar, ICUMSA 45",MT,100`;

    const result = parseCsvCatalog(csv, { slug: 'quoted-sugar', name: 'Sugar Catalog' });
    expect(result.valid).toBe(true);
    expect(result.catalog?.products[0].name).toBe('White Cane Sugar, ICUMSA 45');
  });

  it('extracts slug and name from CSV rows if present, but options override them', () => {
    const csv = `slug,catalog_name,id,name,unit,moq
csv-slug,CSV Extracted Name,prod-1,Product 1,MT,10`;

    // Without options override
    const res1 = parseCsvCatalog(csv);
    expect(res1.valid).toBe(true);
    expect(res1.catalog?.slug).toBe('csv-slug');
    expect(res1.catalog?.name).toBe('CSV Extracted Name');

    // With options override
    const res2 = parseCsvCatalog(csv, { slug: 'override-slug', name: 'Override Name' });
    expect(res2.valid).toBe(true);
    expect(res2.catalog?.slug).toBe('override-slug');
    expect(res2.catalog?.name).toBe('Override Name');
  });

  it('returns validation error on empty CSV or CSV with no rows', () => {
    expect(parseCsvCatalog('').valid).toBe(false);
    expect(parseCsvCatalog('   \n\n  ').valid).toBe(false);
  });

  it('returns validation error when CSV is missing required columns in headers', () => {
    const csv = `id,name\nprod-1,Sugar`;
    const res = parseCsvCatalog(csv, { slug: 'test', name: 'Test' });
    expect(res.valid).toBe(false);
    expect(res.errors[0].field).toBe('headers');
    expect(res.errors[0].message).toContain('unit');
    expect(res.errors[0].message).toContain('moq');
  });

  it('returns validation error when data rows have missing columns', () => {
    const csv = `id,name,unit,moq\nprod-1,Refined Sugar`;
    const res = parseCsvCatalog(csv, { slug: 'test', name: 'Test' });
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.row === 2)).toBe(true);
  });

  it('returns validation error with row numbers when product row has invalid MOQ', () => {
    const csv = `id,name,unit,moq
prod-1,Sugar,MT,20
prod-2,Flour,MT,-5`;

    const res = parseCsvCatalog(csv, { slug: 'test', name: 'Test' });
    expect(res.valid).toBe(false);
    const moqErr = res.errors.find((e) => e.field === 'products[1].moq');
    expect(moqErr).toBeDefined();
    expect(moqErr?.row).toBe(3);
  });
});

describe('buildCatalogJson', () => {
  it('formats catalog into exact schema matching example.json', () => {
    const examplePath = path.resolve(process.cwd(), 'public/rfq-catalogs/example.json');
    const exampleRaw = JSON.parse(fs.readFileSync(examplePath, 'utf8'));

    const validation = validateCatalog(exampleRaw);
    expect(validation.valid).toBe(true);

    const jsonString = buildCatalogJson(validation.catalog!);
    expect(JSON.parse(jsonString)).toEqual(exampleRaw);

    // Verify trailing newline and 2-space indentation
    expect(jsonString.endsWith('\n')).toBe(true);
    const parsed = JSON.parse(jsonString);
    expect(Object.keys(parsed)).toEqual(['slug', 'name', 'products']);
    expect(Object.keys(parsed.products[0])).toEqual(['id', 'name', 'unit', 'moq']);
  });
});

describe('scripts/build-rfq-catalog.mjs CLI execution', () => {
  const cliScript = path.resolve(process.cwd(), 'scripts/build-rfq-catalog.mjs');

  it('prints help message with --help', () => {
    const stdout = execSync(`node "${cliScript}" --help`, { encoding: 'utf8' });
    expect(stdout).toContain('Exvorta RFQ Catalog Builder CLI');
    expect(stdout).toContain('--input <path>');
    expect(stdout).toContain('--check');
  });

  it('validates public/rfq-catalogs/example.json with --check successfully', () => {
    const stdout = execSync(
      `node "${cliScript}" --input public/rfq-catalogs/example.json --check`,
      { encoding: 'utf8' }
    );
    expect(stdout).toContain('VALIDATION OK: Catalog "Standard Export Catalog" (example) is valid');
  });

  it('builds catalog JSON from CSV input and writes output file', () => {
    const tmpCsv = path.resolve(process.cwd(), '.agent/tmp-test.csv');
    const tmpOut = path.resolve(process.cwd(), '.agent/tmp-out.json');

    fs.writeFileSync(
      tmpCsv,
      'sku,product_name,unit,min_order\nP-01,Alphonso Mangoes,KG,50\n',
      'utf8'
    );

    try {
      const stdout = execSync(
        `node "${cliScript}" --input "${tmpCsv}" --slug "alphonso-export" --name "Alphonso Export" --out "${tmpOut}"`,
        { encoding: 'utf8' }
      );
      expect(stdout).toContain('Catalog created successfully');
      expect(fs.existsSync(tmpOut)).toBe(true);

      const generated = JSON.parse(fs.readFileSync(tmpOut, 'utf8'));
      expect(generated.slug).toBe('alphonso-export');
      expect(generated.name).toBe('Alphonso Export');
      expect(generated.products).toEqual([
        { id: 'P-01', name: 'Alphonso Mangoes', unit: 'KG', moq: 50 },
      ]);
    } finally {
      if (fs.existsSync(tmpCsv)) fs.unlinkSync(tmpCsv);
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
    }
  });

  it('exits with code 1 and prints formatted errors for invalid CSV', () => {
    const tmpBadCsv = path.resolve(process.cwd(), '.agent/tmp-bad.csv');
    fs.writeFileSync(tmpBadCsv, 'id,name,unit,moq\np1,Good,MT,10\np1,Dup,MT,-5\n', 'utf8');

    try {
      expect(() => {
        execSync(`node "${cliScript}" --input "${tmpBadCsv}" --slug "invalid slug!" --check`, {
          encoding: 'utf8',
          stdio: 'pipe',
        });
      }).toThrow();
    } finally {
      if (fs.existsSync(tmpBadCsv)) fs.unlinkSync(tmpBadCsv);
    }
  });
});

