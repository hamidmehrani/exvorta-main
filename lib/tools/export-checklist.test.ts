import { describe, it, expect } from 'vitest';
import {
  getAllCorridors,
  getCorridorById,
  getAllDocuments,
  getDocumentsByCorridor,
  getMandatoryDocuments,
  filterDocuments,
  calculateChecklistStats,
  validateAcidSyntax,
  checkCbamThreshold,
  EGYPT_ACID_DISCLAIMER,
  CBAM_DE_MINIMIS_MASS_TONNES,
  CORRIDORS,
  EXPORT_DOCUMENTS,
  type CorridorId,
  type DocumentCategory,
  type RegulatoryClassification,
} from './export-checklist';

describe('Export Documents Checklist Calculation Engine (CONV-09)', () => {
  // ==========================================================================
  // 1. Corridors Metadata & Grounding
  // ==========================================================================
  describe('Trade Corridors Metadata', () => {
    const expectedCorridorIds: CorridorId[] = [
      'intra-gcc',
      'ksa-inbound',
      'egypt-inbound',
      'uae-inbound',
      'eu-cbam',
    ];

    it('defines exactly 5 corridors aligned with regulatory research', () => {
      const corridors = getAllCorridors();
      expect(corridors).toHaveLength(5);
      const ids = corridors.map((c) => c.id);
      expect(ids).toEqual(expectedCorridorIds);
    });

    it('verifies all corridors have non-empty metadata and valid verification date', () => {
      const corridors = getAllCorridors();
      for (const corridor of corridors) {
        expect(corridor.id).toBeDefined();
        expect(corridor.name.trim().length).toBeGreaterThan(0);
        expect(corridor.title.trim().length).toBeGreaterThan(0);
        expect(corridor.description.trim().length).toBeGreaterThan(0);
        expect(corridor.governingAuthority.trim().length).toBeGreaterThan(0);
        expect(corridor.legalBasis.trim().length).toBeGreaterThan(0);
        expect(corridor.classification).toBe('VERIFIED');
        expect(corridor.verifiedDate).toBe('2026-10-27');
      }
    });

    it('retrieves corridors individually by id via getCorridorById', () => {
      for (const id of expectedCorridorIds) {
        const corridor = getCorridorById(id);
        expect(corridor).toBeDefined();
        expect(corridor?.id).toBe(id);
      }
    });

    it('returns undefined for non-existent corridor ID', () => {
      // @ts-expect-error testing invalid ID runtime safety
      const invalid = getCorridorById('unknown-corridor');
      expect(invalid).toBeUndefined();
    });
  });

  // ==========================================================================
  // 2. Document Data Integrity
  // ==========================================================================
  describe('Document Matrix Integrity', () => {
    const validCategories: DocumentCategory[] = [
      'customs',
      'conformity',
      'commercial',
      'transport',
      'sustainability',
    ];

    const validClassifications: RegulatoryClassification[] = [
      'VERIFIED',
      'UNVERIFIED',
      'ASSUMPTION',
    ];

    it('contains all 25 pre-shipment documents across the 5 corridors', () => {
      const docs = getAllDocuments();
      expect(docs.length).toBe(25);
    });

    it('ensures every document has non-empty fields, valid date, and legal basis', () => {
      const docs = getAllDocuments();
      const seenIds = new Set<string>();

      for (const doc of docs) {
        // ID uniqueness
        expect(seenIds.has(doc.id)).toBe(false);
        seenIds.add(doc.id);

        expect(doc.id.trim().length).toBeGreaterThan(0);
        expect(doc.name.trim().length).toBeGreaterThan(0);
        expect(doc.title.trim().length).toBeGreaterThan(0);
        expect(validCategories).toContain(doc.category);
        expect(validClassifications).toContain(doc.classification);
        expect(doc.verifiedDate).toBe('2026-10-27');
        expect(doc.governingAuthority.trim().length).toBeGreaterThan(0);
        expect(doc.legalBasis.trim().length).toBeGreaterThan(0);
        expect(typeof doc.mandatory).toBe('boolean');
        expect(doc.criticalTiming.trim().length).toBeGreaterThan(0);
        expect(doc.nonComplianceRisk.trim().length).toBeGreaterThan(0);
        expect(Array.isArray(doc.requiredDataFields)).toBe(true);
        expect(doc.requiredDataFields.length).toBeGreaterThanOrEqual(3);

        for (const field of doc.requiredDataFields) {
          expect(field.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  // ==========================================================================
  // 3. Egypt ACID Disclaimer & Regulatory Grounding
  // ==========================================================================
  describe('Egypt ACID Disclaimer & Unverified Syntax', () => {
    it('exports the exact regulatory disclaimer string required by FACTS-0', () => {
      expect(EGYPT_ACID_DISCLAIMER).toBe(
        '*Not verified: Exact 19-digit syntax and checksum structure of Egypt ACID number (awaiting Egyptian forwarder / MTS technical confirmer).*',
      );
    });

    it('attaches the exact disclaimer to the Egypt ACID document', () => {
      const acidDoc = getAllDocuments().find((d) => d.id === 'egypt-acid-cargo-x');
      expect(acidDoc).toBeDefined();
      expect(acidDoc?.disclaimer).toBe(EGYPT_ACID_DISCLAIMER);
      expect(acidDoc?.classification).toBe('UNVERIFIED');
      expect(acidDoc?.verifiedDate).toBe('2026-10-27');
      expect(acidDoc?.governingAuthority).toContain('MTS Nafeza');
      expect(acidDoc?.legalBasis).toContain('Decree No. 38/2021');
    });

    it('validates 19-digit numerical syntax for provisional ACID numbers', () => {
      const validAcid = '1234567890123456789'; // 19 digits
      const result = validateAcidSyntax(validAcid);

      expect(result.isValidFormat).toBe(true);
      expect(result.isVerifiedSpec).toBe(false);
      expect(result.disclaimer).toBe(EGYPT_ACID_DISCLAIMER);
      expect(result.message).toContain('provisional 19-digit');
    });

    it('handles trimmed valid 19-digit ACID numbers', () => {
      const result = validateAcidSyntax('  9876543210123456789  ');
      expect(result.isValidFormat).toBe(true);
      expect(result.isVerifiedSpec).toBe(false);
    });

    it('rejects invalid ACID numbers while maintaining unverified spec flag', () => {
      const tooShort = validateAcidSyntax('12345678');
      expect(tooShort.isValidFormat).toBe(false);
      expect(tooShort.isVerifiedSpec).toBe(false);
      expect(tooShort.disclaimer).toBe(EGYPT_ACID_DISCLAIMER);

      const tooLong = validateAcidSyntax('12345678901234567890'); // 20 digits
      expect(tooLong.isValidFormat).toBe(false);

      const nonNumeric = validateAcidSyntax('123456789012345678A');
      expect(nonNumeric.isValidFormat).toBe(false);

      const empty = validateAcidSyntax('');
      expect(empty.isValidFormat).toBe(false);

      // @ts-expect-error testing unexpected type safety
      const nonString = validateAcidSyntax(null);
      expect(nonString.isValidFormat).toBe(false);
      expect(nonString.isVerifiedSpec).toBe(false);
    });
  });

  // ==========================================================================
  // 4. Filtering Functions
  // ==========================================================================
  describe('Document Filtering Utility Functions', () => {
    it('retrieves documents by specific corridor', () => {
      const gccDocs = getDocumentsByCorridor('intra-gcc');
      expect(gccDocs).toHaveLength(5);
      expect(gccDocs.every((d) => d.corridorId === 'intra-gcc')).toBe(true);

      const ksaDocs = getDocumentsByCorridor('ksa-inbound');
      expect(ksaDocs).toHaveLength(5);
      expect(ksaDocs.every((d) => d.corridorId === 'ksa-inbound')).toBe(true);

      const egyptDocs = getDocumentsByCorridor('egypt-inbound');
      expect(egyptDocs).toHaveLength(5);
      expect(egyptDocs.every((d) => d.corridorId === 'egypt-inbound')).toBe(true);

      const uaeDocs = getDocumentsByCorridor('uae-inbound');
      expect(uaeDocs).toHaveLength(5);
      expect(uaeDocs.every((d) => d.corridorId === 'uae-inbound')).toBe(true);

      const euDocs = getDocumentsByCorridor('eu-cbam');
      expect(euDocs).toHaveLength(5);
      expect(euDocs.every((d) => d.corridorId === 'eu-cbam')).toBe(true);
    });

    it('filters mandatory documents globally and by corridor', () => {
      const allMandatory = getMandatoryDocuments();
      expect(allMandatory.length).toBe(24);
      expect(allMandatory.every((d) => d.mandatory)).toBe(true);

      // In EU CBAM corridor, EUR.1 is optional (mandatory: false)
      const euMandatory = getMandatoryDocuments('eu-cbam');
      expect(euMandatory).toHaveLength(4);
      expect(euMandatory.every((d) => d.corridorId === 'eu-cbam' && d.mandatory)).toBe(true);

      const gccMandatory = getMandatoryDocuments('intra-gcc');
      expect(gccMandatory).toHaveLength(5);
    });

    it('filters documents using multi-criteria filterDocuments()', () => {
      // Filter by category
      const sustainabilityDocs = filterDocuments({ category: 'sustainability' });
      expect(sustainabilityDocs).toHaveLength(2);
      expect(sustainabilityDocs.every((d) => d.category === 'sustainability')).toBe(true);

      const conformityDocs = filterDocuments({ category: 'conformity' });
      expect(conformityDocs).toHaveLength(2);
      expect(conformityDocs.every((d) => d.category === 'conformity')).toBe(true);

      // Combined corridor + category filter
      const ksaConformity = filterDocuments({
        corridorId: 'ksa-inbound',
        category: 'conformity',
      });
      expect(ksaConformity).toHaveLength(2);
      expect(ksaConformity.map((d) => d.id)).toEqual(['ksa-saber-scoc', 'ksa-saber-pcoc']);

      // Corridor + mandatoryOnly
      const euMandatoryFiltered = filterDocuments({
        corridorId: 'eu-cbam',
        mandatoryOnly: true,
      });
      expect(euMandatoryFiltered).toHaveLength(4);

      // Corridor without mandatoryOnly returns all 5
      const euAllFiltered = filterDocuments({
        corridorId: 'eu-cbam',
        mandatoryOnly: false,
      });
      expect(euAllFiltered).toHaveLength(5);

      // Calling filterDocuments with no filters returns all documents
      expect(filterDocuments()).toHaveLength(25);
      expect(filterDocuments({})).toHaveLength(25);
    });
  });

  // ==========================================================================
  // 5. Checklist Statistics Calculation
  // ==========================================================================
  describe('calculateChecklistStats', () => {
    it('accurately computes summary metrics across corridors and categories', () => {
      const stats = calculateChecklistStats();

      expect(stats.totalDocuments).toBe(25);
      expect(stats.corridorsCount).toBe(5);
      expect(stats.mandatoryDocuments).toBe(24);
      expect(stats.optionalDocuments).toBe(1);
      expect(stats.verifiedDate).toBe('2026-10-27');

      // Corridor breakdowns
      expect(stats.byCorridor['intra-gcc']).toEqual({ total: 5, mandatory: 5, optional: 0 });
      expect(stats.byCorridor['ksa-inbound']).toEqual({ total: 5, mandatory: 5, optional: 0 });
      expect(stats.byCorridor['egypt-inbound']).toEqual({ total: 5, mandatory: 5, optional: 0 });
      expect(stats.byCorridor['uae-inbound']).toEqual({ total: 5, mandatory: 5, optional: 0 });
      expect(stats.byCorridor['eu-cbam']).toEqual({ total: 5, mandatory: 4, optional: 1 });

      // Verification classification breakdown
      expect(stats.byClassification.VERIFIED).toBe(24);
      expect(stats.byClassification.UNVERIFIED).toBe(1); // Egypt ACID 19-digit spec
      expect(stats.byClassification.ASSUMPTION).toBe(0);

      // Category breakdown sums to total
      const categorySum = Object.values(stats.byCategory).reduce((a, b) => a + b, 0);
      expect(categorySum).toBe(25);
    });
  });

  // ==========================================================================
  // 6. EU CBAM 50-Tonne De Minimis Exemption Calculation
  // ==========================================================================
  describe('checkCbamThreshold (EU CBAM 50-Tonne Exemption Rule)', () => {
    it('marks consignments <= 50 tonnes as de minimis exempt', () => {
      // 0 tonnes
      const zero = checkCbamThreshold(0);
      expect(zero.isExempt).toBe(true);
      expect(zero.requiresReporting).toBe(false);
      expect(zero.thresholdTonnes).toBe(50);
      expect(zero.classification).toBe('VERIFIED');
      expect(zero.verifiedDate).toBe('2026-10-27');
      expect(zero.message).toContain('within the de minimis threshold');

      // 25 tonnes
      const mid = checkCbamThreshold(25);
      expect(mid.isExempt).toBe(true);
      expect(mid.requiresReporting).toBe(false);

      // Exactly 50.0 tonnes (boundary)
      const boundary = checkCbamThreshold(50);
      expect(boundary.isExempt).toBe(true);
      expect(boundary.requiresReporting).toBe(false);
      expect(boundary.netMassTonnes).toBe(50);
    });

    it('marks consignments > 50 tonnes as requiring full CBAM reporting', () => {
      // Just above boundary
      const aboveBoundary = checkCbamThreshold(50.01);
      expect(aboveBoundary.isExempt).toBe(false);
      expect(aboveBoundary.requiresReporting).toBe(true);
      expect(aboveBoundary.thresholdTonnes).toBe(50);
      expect(aboveBoundary.classification).toBe('VERIFIED');
      expect(aboveBoundary.verifiedDate).toBe('2026-10-27');
      expect(aboveBoundary.message).toContain('exceeds the de minimis threshold');

      // 500 tonnes
      const heavy = checkCbamThreshold(500);
      expect(heavy.isExempt).toBe(false);
      expect(heavy.requiresReporting).toBe(true);
    });

    it('safely handles non-positive or non-finite mass values', () => {
      const negative = checkCbamThreshold(-10);
      expect(negative.netMassTonnes).toBe(0);
      expect(negative.isExempt).toBe(true);
      expect(negative.requiresReporting).toBe(false);

      const nanMass = checkCbamThreshold(Number.NaN);
      expect(nanMass.netMassTonnes).toBe(0);
      expect(nanMass.isExempt).toBe(true);
    });
  });

  // ==========================================================================
  // 7. Immutability & Exports Check
  // ==========================================================================
  describe('Constants and Matrix Immutability', () => {
    it('exports immutable arrays and constants', () => {
      expect(CBAM_DE_MINIMIS_MASS_TONNES).toBe(50);
      expect(Array.isArray(CORRIDORS)).toBe(true);
      expect(Array.isArray(EXPORT_DOCUMENTS)).toBe(true);

      const corridorsCopy = getAllCorridors();
      corridorsCopy.pop();
      expect(getAllCorridors()).toHaveLength(5);

      const docsCopy = getAllDocuments();
      docsCopy.pop();
      expect(getAllDocuments()).toHaveLength(25);
    });
  });
});
