import { describe, expect, it } from 'vitest';
import {
  calculateReadiness,
  DEFAULT_ASSESSMENT_INPUT,
  deserializeAssessmentInput,
  REGULATORY_STATUTES,
  serializeAssessmentInput,
  type ReadinessAssessmentInput,
} from './einv-readiness';

describe('UAE E-Invoicing (PINT-AE) Readiness Engine (TOOL-6)', () => {
  // --------------------------------------------------------------------------
  // 1. Score Calculations for All Profiles
  // --------------------------------------------------------------------------
  describe('Score calculations across maturity profiles', () => {
    it('calculates perfect score of 100 for fully compliant enterprise', () => {
      const perfectInput: ReadinessAssessmentInput = {
        entityType: 'enterprise_large',
        erpSystem: 'sap_s4',
        monthlyVolume: 'over_10000',
        aspStatus: 'integrated',
        dataHygiene: {
          hasValidTrn: true,
          customerTrnVerified: true,
          peppolIdReady: true,
          pintTaxCategoryMapped: true,
          uaeDataResidencyConfirmed: true,
        },
        transactionScope: {
          b2bDomestic: true,
          b2gGovernment: true,
          b2cRetail: true,
          crossBorderExport: true,
        },
      };

      const result = calculateReadiness(perfectInput, '2026-10-01');

      expect(result.score).toBe(100);
      expect(result.tier).toBe('compliant_ready');
      expect(result.tierLabel).toBe('Compliant & Ready');

      // Verify individual category ceilings
      expect(result.scoreCategories.erpReadiness.score).toBe(25);
      expect(result.scoreCategories.erpReadiness.maxScore).toBe(25);
      expect(result.scoreCategories.aspProcurement.score).toBe(30);
      expect(result.scoreCategories.aspProcurement.maxScore).toBe(30);
      expect(result.scoreCategories.masterDataHygiene.score).toBe(25);
      expect(result.scoreCategories.masterDataHygiene.maxScore).toBe(25);
      expect(result.scoreCategories.governanceArchitecture.score).toBe(20);
      expect(result.scoreCategories.governanceArchitecture.maxScore).toBe(20);

      // Fully prepared enterprise has 0 critical gaps
      expect(result.criticalGaps).toHaveLength(0);
    });

    it('calculates zero score of 0 for unprepared manual Excel operation', () => {
      const zeroInput: ReadinessAssessmentInput = {
        entityType: 'sme',
        erpSystem: 'manual_excel',
        monthlyVolume: 'under_100',
        aspStatus: 'not_started',
        dataHygiene: {
          hasValidTrn: false,
          customerTrnVerified: false,
          peppolIdReady: false,
          pintTaxCategoryMapped: false,
          uaeDataResidencyConfirmed: false,
        },
        transactionScope: {
          b2bDomestic: false,
          b2gGovernment: false,
          b2cRetail: false,
          crossBorderExport: false,
        },
      };

      const result = calculateReadiness(zeroInput, '2026-10-01');

      expect(result.score).toBe(0);
      expect(result.tier).toBe('critical_action');
      expect(result.tierLabel).toBe('Critical Action Required');

      expect(result.scoreCategories.erpReadiness.score).toBe(0);
      expect(result.scoreCategories.aspProcurement.score).toBe(0);
      expect(result.scoreCategories.masterDataHygiene.score).toBe(0);
      expect(result.scoreCategories.governanceArchitecture.score).toBe(0);

      expect(result.criticalGaps.length).toBeGreaterThan(0);
    });

    it('calculates medium scores correctly for substantially prepared profile', () => {
      const substantialInput: ReadinessAssessmentInput = {
        entityType: 'sme',
        erpSystem: 'zoho_books', // 20 pts
        monthlyVolume: '100_to_1000',
        aspStatus: 'contracted', // 20 pts
        dataHygiene: {
          hasValidTrn: true, // 5 pts
          customerTrnVerified: true, // 5 pts
          peppolIdReady: true, // 5 pts
          pintTaxCategoryMapped: false,
          uaeDataResidencyConfirmed: true, // 5 pts (total hygiene: 20 pts)
        },
        transactionScope: {
          b2bDomestic: true,
          b2gGovernment: false,
          b2cRetail: false,
          crossBorderExport: false, // governance: any(5) + b2b(5) + non-manual(5) + residency&trn(5) = 20 pts
        },
      };

      const result = calculateReadiness(substantialInput, '2026-10-01');

      // 20 + 20 + 20 + 20 = 80
      expect(result.score).toBe(80);
      expect(result.tier).toBe('substantially_prepared');
      expect(result.tierLabel).toBe('Substantially Prepared');
    });

    it('calculates medium score for developing profile', () => {
      const developingInput: ReadinessAssessmentInput = {
        entityType: 'sme',
        erpSystem: 'quickbooks', // 16 pts
        monthlyVolume: '100_to_1000',
        aspStatus: 'shortlisting', // 10 pts
        dataHygiene: {
          hasValidTrn: true, // 5 pts
          customerTrnVerified: false,
          peppolIdReady: false,
          pintTaxCategoryMapped: false,
          uaeDataResidencyConfirmed: false, // total hygiene: 5 pts
        },
        transactionScope: {
          b2bDomestic: true,
          b2gGovernment: false,
          b2cRetail: false,
          crossBorderExport: false, // governance: any(5) + b2b(5) + non-manual(5) + residency(0) = 15 pts
        },
      };

      const result = calculateReadiness(developingInput, '2026-10-01');

      // 16 + 10 + 5 + 15 = 46
      expect(result.score).toBe(46);
      expect(result.tier).toBe('developing');
      expect(result.tierLabel).toBe('Developing Readiness');
    });
  });

  // --------------------------------------------------------------------------
  // 2. Phase Detection & Statutory Deadlines
  // --------------------------------------------------------------------------
  describe('Phase detection and statutory deadlines', () => {
    it('maps enterprise_large (>= AED 50M) to Phase 1 with Oct 2026 / Jan 2027 deadlines', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
      };

      const result = calculateReadiness(input);

      expect(result.phase).toBe('Phase 1');
      expect(result.aspDeadline).toBe('30 October 2026');
      expect(result.goLiveDeadline).toBe('1 January 2027');
    });

    it('maps sme (< AED 50M) to Phase 2 with March 2027 / July 2027 deadlines', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'sme',
      };

      const result = calculateReadiness(input);

      expect(result.phase).toBe('Phase 2');
      expect(result.aspDeadline).toBe('31 March 2027');
      expect(result.goLiveDeadline).toBe('1 July 2027');
    });

    it('maps government to Phase 3 with March 2027 / October 2027 deadlines', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'government',
      };

      const result = calculateReadiness(input);

      expect(result.phase).toBe('Phase 3');
      expect(result.aspDeadline).toBe('31 March 2027');
      expect(result.goLiveDeadline).toBe('1 October 2027');
    });

    it('maps micro_nonresident to Pilot / Exempt phase', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'micro_nonresident',
      };

      const result = calculateReadiness(input);

      expect(result.phase).toBe('Pilot / Exempt');
      expect(result.aspDeadline).toBe('31 March 2027');
      expect(result.goLiveDeadline).toBe('1 July 2027');
    });
  });

  // --------------------------------------------------------------------------
  // 3. Days Remaining Calculation with Deterministic Reference Dates
  // --------------------------------------------------------------------------
  describe('Days remaining calculation with deterministic reference dates', () => {
    it('calculates deterministic remaining days from 2026-10-01 for Phase 1', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
      };

      const result = calculateReadiness(input, '2026-10-01');

      // 30 October 2026 - 1 October 2026 = 29 days
      expect(result.daysUntilAspDeadline).toBe(29);
      expect(result.aspDeadlinePassed).toBe(false);

      // 1 January 2027 - 1 October 2026 = 30 + 30 + 31 + 1 = 92 days
      expect(result.daysUntilGoLive).toBe(92);
      expect(result.goLivePassed).toBe(false);
    });

    it('handles exact deadline day (0 days remaining, not yet passed)', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
      };

      const result = calculateReadiness(input, '2026-10-30');

      expect(result.daysUntilAspDeadline).toBe(0);
      expect(result.aspDeadlinePassed).toBe(false);
    });

    it('flags deadline as passed when reference date is after deadline', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
      };

      const result = calculateReadiness(input, '2026-10-31');

      expect(result.daysUntilAspDeadline).toBe(0);
      expect(result.aspDeadlinePassed).toBe(true);

      // Go-live 1 January 2027 is still ahead
      expect(result.goLivePassed).toBe(false);
      expect(result.daysUntilGoLive).toBe(62);
    });

    it('flags both deadlines as passed when reference date is after go-live', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
      };

      const result = calculateReadiness(input, '2027-01-05');

      expect(result.aspDeadlinePassed).toBe(true);
      expect(result.goLivePassed).toBe(true);
      expect(result.daysUntilAspDeadline).toBe(0);
      expect(result.daysUntilGoLive).toBe(0);
    });

    it('accepts Date objects as well as ISO strings', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'sme',
      };

      const refDate = new Date('2027-01-01T00:00:00Z');
      const result = calculateReadiness(input, refDate);

      // 31 March 2027 - 1 January 2027 = 31 (Jan) + 28 (Feb 2027) + 30 (Mar) = 89 days
      expect(result.daysUntilAspDeadline).toBe(89);
      expect(result.aspDeadlinePassed).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Critical Gap Detection Logic
  // --------------------------------------------------------------------------
  describe('Gap detection logic', () => {
    it('detects critical gap when manual Excel is used', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        erpSystem: 'manual_excel',
      };

      const result = calculateReadiness(input);
      const manualGap = result.criticalGaps.find((g) => g.id === 'gap-manual-excel');

      expect(manualGap).toBeDefined();
      expect(manualGap?.severity).toBe('critical');
      expect(manualGap?.regulatoryCitation).toContain('Cabinet Decision No. 106 of 2025');
    });

    it('detects critical gap when Phase 1 enterprise has not appointed an ASP', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
        aspStatus: 'not_started',
      };

      const result = calculateReadiness(input);
      const aspGap = result.criticalGaps.find((g) => g.id === 'gap-phase1-asp-unappointed');

      expect(aspGap).toBeDefined();
      expect(aspGap?.severity).toBe('critical');
      expect(aspGap?.regulatoryCitation).toContain('Ministerial Resolution No. 66 of 2026');
    });

    it('does not trigger Phase 1 ASP gap when enterprise is already contracted or integrated', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        entityType: 'enterprise_large',
        aspStatus: 'contracted',
      };

      const result = calculateReadiness(input);
      const aspGap = result.criticalGaps.find((g) => g.id === 'gap-phase1-asp-unappointed');

      expect(aspGap).toBeUndefined();
    });

    it('detects critical gap when valid TRN is missing', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        dataHygiene: {
          ...DEFAULT_ASSESSMENT_INPUT.dataHygiene,
          hasValidTrn: false,
        },
      };

      const result = calculateReadiness(input);
      const trnGap = result.criticalGaps.find((g) => g.id === 'gap-missing-trn');

      expect(trnGap).toBeDefined();
      expect(trnGap?.severity).toBe('critical');
    });

    it('detects critical gap when UAE data residency is unconfirmed', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        dataHygiene: {
          ...DEFAULT_ASSESSMENT_INPUT.dataHygiene,
          uaeDataResidencyConfirmed: false,
        },
      };

      const result = calculateReadiness(input);
      const residencyGap = result.criticalGaps.find((g) => g.id === 'gap-data-residency');

      expect(residencyGap).toBeDefined();
      expect(residencyGap?.severity).toBe('critical');
    });

    it('detects high-volume fragility gap for over 1,000 monthly invoices on legacy ERP', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        erpSystem: 'custom_legacy',
        monthlyVolume: 'over_10000',
      };

      const result = calculateReadiness(input);
      const volumeGap = result.criticalGaps.find((g) => g.id === 'gap-high-volume-fragility');

      expect(volumeGap).toBeDefined();
      expect(volumeGap?.severity).toBe('critical');
    });

    it('detects B2G gap when government transactions are conducted without an ASP', () => {
      const input: ReadinessAssessmentInput = {
        ...DEFAULT_ASSESSMENT_INPUT,
        aspStatus: 'not_started',
        transactionScope: {
          ...DEFAULT_ASSESSMENT_INPUT.transactionScope,
          b2gGovernment: true,
        },
      };

      const result = calculateReadiness(input);
      const b2gGap = result.criticalGaps.find((g) => g.id === 'gap-b2g-without-asp');

      expect(b2gGap).toBeDefined();
      expect(b2gGap?.severity).toBe('high');
    });
  });

  // --------------------------------------------------------------------------
  // 5. ASP Checklist Generation
  // --------------------------------------------------------------------------
  describe('ASP checklist generation', () => {
    it('generates Peppol 5-corner compliant evaluation checklist', () => {
      const result = calculateReadiness(DEFAULT_ASSESSMENT_INPUT);

      expect(result.aspSelectionChecklist.length).toBeGreaterThanOrEqual(7);

      const mofItem = result.aspSelectionChecklist.find((i) => i.id === 'asp-mof-accreditation');
      expect(mofItem).toBeDefined();
      expect(mofItem?.mandatory).toBe(true);
      expect(mofItem?.cornerCapability).toBe('Corner 2/3 (ASP)');

      const c5Item = result.aspSelectionChecklist.find((i) => i.id === 'corner-5-reporting');
      expect(c5Item).toBeDefined();
      expect(c5Item?.mandatory).toBe(true);
      expect(c5Item?.cornerCapability).toBe('Corner 5 (FTA Reporting)');

      const ublItem = result.aspSelectionChecklist.find((i) => i.id === 'ubl-pint-ae-validation');
      expect(ublItem).toBeDefined();
      expect(ublItem?.cornerCapability).toBe('UBL 2.1 PINT-AE');

      const residencyItem = result.aspSelectionChecklist.find((i) => i.id === 'uae-data-residency');
      expect(residencyItem).toBeDefined();
      expect(residencyItem?.cornerCapability).toBe('Data Residency');
    });
  });

  // --------------------------------------------------------------------------
  // 6. URL Serialization & Deserialization
  // --------------------------------------------------------------------------
  describe('URL serialization and deserialization', () => {
    it('serializes complete input into valid URL query string', () => {
      const input: ReadinessAssessmentInput = {
        entityType: 'enterprise_large',
        erpSystem: 'sap_s4',
        monthlyVolume: 'over_10000',
        aspStatus: 'integrated',
        dataHygiene: {
          hasValidTrn: true,
          customerTrnVerified: true,
          peppolIdReady: true,
          pintTaxCategoryMapped: true,
          uaeDataResidencyConfirmed: true,
        },
        transactionScope: {
          b2bDomestic: true,
          b2gGovernment: true,
          b2cRetail: false,
          crossBorderExport: true,
        },
      };

      const query = serializeAssessmentInput(input);
      expect(query).toContain('entityType=enterprise_large');
      expect(query).toContain('erpSystem=sap_s4');
      expect(query).toContain('hasValidTrn=1');
      expect(query).toContain('b2cRetail=0');
      expect(query).toContain('crossBorderExport=1');
    });

    it('round-trips input through serialization and deserialization accurately', () => {
      const original: ReadinessAssessmentInput = {
        entityType: 'sme',
        erpSystem: 'zoho_books',
        monthlyVolume: '100_to_1000',
        aspStatus: 'contracted',
        dataHygiene: {
          hasValidTrn: true,
          customerTrnVerified: false,
          peppolIdReady: true,
          pintTaxCategoryMapped: false,
          uaeDataResidencyConfirmed: true,
        },
        transactionScope: {
          b2bDomestic: true,
          b2gGovernment: false,
          b2cRetail: true,
          crossBorderExport: false,
        },
      };

      const query = serializeAssessmentInput(original);
      const parsed = deserializeAssessmentInput(query);

      expect(parsed.entityType).toBe(original.entityType);
      expect(parsed.erpSystem).toBe(original.erpSystem);
      expect(parsed.monthlyVolume).toBe(original.monthlyVolume);
      expect(parsed.aspStatus).toBe(original.aspStatus);
      expect(parsed.dataHygiene).toEqual(original.dataHygiene);
      expect(parsed.transactionScope).toEqual(original.transactionScope);
    });

    it('handles query strings with leading question marks or URL parameters', () => {
      const parsed = deserializeAssessmentInput('?entityType=government&erpSystem=oracle_cloud');
      expect(parsed.entityType).toBe('government');
      expect(parsed.erpSystem).toBe('oracle_cloud');
    });

    it('safely handles empty, null, undefined, and malformed inputs', () => {
      expect(deserializeAssessmentInput('')).toEqual({});
      expect(deserializeAssessmentInput(null)).toEqual({});
      expect(deserializeAssessmentInput(undefined)).toEqual({});
      expect(deserializeAssessmentInput('invalid_gibberish&&==')).toEqual({});
      expect(deserializeAssessmentInput('entityType=invalid_entity&erpSystem=invalid_erp')).toEqual({});
    });

    it('supports concise parameter aliases', () => {
      const parsed = deserializeAssessmentInput('entity=sme&erp=tally&trn=1&residency=1&b2b=1');
      expect(parsed.entityType).toBe('sme');
      expect(parsed.erpSystem).toBe('tally');
      expect(parsed.dataHygiene?.hasValidTrn).toBe(true);
      expect(parsed.dataHygiene?.uaeDataResidencyConfirmed).toBe(true);
      expect(parsed.transactionScope?.b2bDomestic).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Statutory Reference Completeness
  // --------------------------------------------------------------------------
  describe('Statutory reference completeness', () => {
    it('includes all primary UAE e-invoicing decrees and ministerial decisions', () => {
      expect(REGULATORY_STATUTES.FDL_16_2024).toBeDefined();
      expect(REGULATORY_STATUTES.FDL_17_2024).toBeDefined();
      expect(REGULATORY_STATUTES.CAB_DEC_106_2025).toBeDefined();
      expect(REGULATORY_STATUTES.MD_243_2025).toBeDefined();
      expect(REGULATORY_STATUTES.MD_244_2025).toBeDefined();
      expect(REGULATORY_STATUTES.MR_66_2026).toBeDefined();

      for (const statute of Object.values(REGULATORY_STATUTES)) {
        expect(statute.code).toBeTruthy();
        expect(statute.title).toBeTruthy();
        expect(statute.effectiveDate).toBeTruthy();
        expect(statute.source).toBeTruthy();
        expect(statute.lastVerified).toBe('2026-10-27');
      }
    });

    it('matches citations attached to generated readiness results', () => {
      const result = calculateReadiness(DEFAULT_ASSESSMENT_INPUT);
      expect(result.regulatoryReferences).toHaveLength(6);
      const codes = result.regulatoryReferences.map((r) => r.code);
      expect(codes).toContain('FDL-16-2024');
      expect(codes).toContain('CAB-DEC-106-2025');
      expect(codes).toContain('MR-66-2026');
    });
  });
});
