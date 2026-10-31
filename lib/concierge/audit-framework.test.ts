import { describe, expect, it } from 'vitest';
import {
  AUDIT_PILLARS,
  AUDIT_PILLAR_IDS,
  calculate24hDeadline,
  calculateOverallScore,
  getAuditGrade,
  SLA_HOURS,
  validateDocumentChecklist,
  type AuditPillarId,
} from './audit-framework';

describe('24-Hour Concierge Export Audit Framework', () => {
  describe('Pillar definitions and max score sum = 100', () => {
    it('defines exactly 4 pillars matching AuditPillarId', () => {
      expect(AUDIT_PILLARS.length).toBe(4);
      expect(AUDIT_PILLAR_IDS.length).toBe(4);

      const expectedIds: AuditPillarId[] = [
        'technical_infrastructure',
        'trade_architecture',
        'institutional_trust',
        'commercial_conversion',
      ];
      const actualIds = AUDIT_PILLARS.map((p) => p.id);
      expect(actualIds).toEqual(expectedIds);
    });

    it('allocates exactly 25 points to each pillar, summing to 100 points overall', () => {
      for (const pillar of AUDIT_PILLARS) {
        expect(pillar.maxScore).toBe(25);
      }
      const totalMaxScore = AUDIT_PILLARS.reduce((acc, p) => acc + p.maxScore, 0);
      expect(totalMaxScore).toBe(100);
    });

    it('sub-criteria points inside each pillar sum exactly to 25 points', () => {
      for (const pillar of AUDIT_PILLARS) {
        expect(pillar.criteria.length).toBeGreaterThan(0);
        const criteriaSum = pillar.criteria.reduce((acc, c) => acc + c.maxPoints, 0);
        expect(criteriaSum).toBe(25);
      }
    });

    it('exposes pillars by both array index and pillar key', () => {
      expect(AUDIT_PILLARS.technical_infrastructure.id).toBe('technical_infrastructure');
      expect(AUDIT_PILLARS.trade_architecture.id).toBe('trade_architecture');
      expect(AUDIT_PILLARS.institutional_trust.id).toBe('institutional_trust');
      expect(AUDIT_PILLARS.commercial_conversion.id).toBe('commercial_conversion');
      expect(AUDIT_PILLARS[0].id).toBe('technical_infrastructure');
    });

    it('sets SLA_HOURS constant to 24', () => {
      expect(SLA_HOURS).toBe(24);
    });
  });

  describe('calculateOverallScore', () => {
    it('sums pillar scores accurately for valid inputs', () => {
      const scores = {
        technical_infrastructure: 20,
        trade_architecture: 25,
        institutional_trust: 15,
        commercial_conversion: 20,
      };
      expect(calculateOverallScore(scores)).toBe(80);
    });

    it('returns 100 for perfect scores across all pillars', () => {
      const perfect = {
        technical_infrastructure: 25,
        trade_architecture: 25,
        institutional_trust: 25,
        commercial_conversion: 25,
      };
      expect(calculateOverallScore(perfect)).toBe(100);
    });

    it('returns 0 when all scores are 0', () => {
      const zero = {
        technical_infrastructure: 0,
        trade_architecture: 0,
        institutional_trust: 0,
        commercial_conversion: 0,
      };
      expect(calculateOverallScore(zero)).toBe(0);
    });

    it('clamps scores above 100 to 100', () => {
      const overflowing = {
        technical_infrastructure: 35,
        trade_architecture: 40,
        institutional_trust: 30,
        commercial_conversion: 25,
      };
      expect(calculateOverallScore(overflowing)).toBe(100);
    });

    it('clamps negative scores to 0', () => {
      const negative = {
        technical_infrastructure: -10,
        trade_architecture: -5,
        institutional_trust: 0,
        commercial_conversion: 0,
      };
      expect(calculateOverallScore(negative)).toBe(0);
    });

    it('handles partial scores gracefully', () => {
      const partial = {
        technical_infrastructure: 20,
        trade_architecture: 20,
      };
      expect(calculateOverallScore(partial)).toBe(40);
    });
  });

  describe('getAuditGrade', () => {
    it('categorizes scores below 50 as Critical Risk', () => {
      const lowZero = getAuditGrade(0);
      expect(lowZero.grade).toBe('Critical Risk');
      expect(lowZero.description).toBeTruthy();

      const lowEdge = getAuditGrade(49);
      expect(lowEdge.grade).toBe('Critical Risk');
    });

    it('categorizes scores from 50 to 79 as Needs Hardening', () => {
      const boundaryLow = getAuditGrade(50);
      expect(boundaryLow.grade).toBe('Needs Hardening');
      expect(boundaryLow.description).toBeTruthy();

      const mid = getAuditGrade(65);
      expect(mid.grade).toBe('Needs Hardening');

      const boundaryHigh = getAuditGrade(79);
      expect(boundaryHigh.grade).toBe('Needs Hardening');
    });

    it('categorizes scores 80 and above as Institutional Grade', () => {
      const boundary = getAuditGrade(80);
      expect(boundary.grade).toBe('Institutional Grade');
      expect(boundary.description).toBeTruthy();

      const excellent = getAuditGrade(95);
      expect(excellent.grade).toBe('Institutional Grade');

      const perfect = getAuditGrade(100);
      expect(perfect.grade).toBe('Institutional Grade');
    });
  });

  describe('calculate24hDeadline', () => {
    it('calculates exactly 24 hours later', () => {
      const intakeDate = new Date('2026-11-01T10:00:00.000Z');
      const { deadlineDate } = calculate24hDeadline(intakeDate);

      const expectedMs = intakeDate.getTime() + 24 * 60 * 60 * 1000;
      expect(deadlineDate.getTime()).toBe(expectedMs);
      expect(deadlineDate.toISOString()).toBe('2026-11-02T10:00:00.000Z');
    });

    it('formats GST timestamp correctly with Asia/Dubai (+4 hours) timezone', () => {
      // 12:00 UTC = 16:00 (4:00 PM) GST
      const intakeDate = new Date('2026-10-31T12:00:00.000Z');
      const { formattedGST } = calculate24hDeadline(intakeDate);

      expect(formattedGST).toContain('GST');
      expect(formattedGST).toContain('04:00 PM');
      expect(formattedGST).toContain('Nov 01, 2026');
    });

    it('calculates hoursRemaining accurately based on referenceDate', () => {
      const intakeDate = new Date('2026-11-01T00:00:00.000Z');

      // At intake time: 24 hours remaining
      const atIntake = calculate24hDeadline(intakeDate, intakeDate);
      expect(atIntake.hoursRemaining).toBe(24);

      // 6 hours after intake: 18 hours remaining
      const sixHoursLater = new Date(intakeDate.getTime() + 6 * 60 * 60 * 1000);
      const atSixHours = calculate24hDeadline(intakeDate, sixHoursLater);
      expect(atSixHours.hoursRemaining).toBe(18);

      // Past deadline: 0 hours remaining
      const afterDeadline = new Date(intakeDate.getTime() + 25 * 60 * 60 * 1000);
      const atPast = calculate24hDeadline(intakeDate, afterDeadline);
      expect(atPast.hoursRemaining).toBe(0);
    });
  });

  describe('validateDocumentChecklist', () => {
    it('handles empty checklist (0% complete, invalid, 3 missing)', () => {
      const emptyChecklist = {
        commercialInvoice: false,
        packingList: false,
        billOfLading: false,
      };

      const result = validateDocumentChecklist(emptyChecklist);
      expect(result.valid).toBe(false);
      expect(result.completenessPercentage).toBe(0);
      expect(result.missing).toEqual(['commercialInvoice', 'packingList', 'billOfLading']);
    });

    it('handles partial checklist with CI only (33% complete, invalid, 2 missing)', () => {
      const ciOnly = {
        commercialInvoice: true,
        packingList: false,
        billOfLading: false,
      };

      const result = validateDocumentChecklist(ciOnly);
      expect(result.valid).toBe(false);
      expect(result.completenessPercentage).toBe(33);
      expect(result.missing).toEqual(['packingList', 'billOfLading']);
    });

    it('handles partial checklist with 2 documents (67% complete, invalid, 1 missing)', () => {
      const twoDocs = {
        commercialInvoice: true,
        packingList: true,
        billOfLading: false,
      };

      const result = validateDocumentChecklist(twoDocs);
      expect(result.valid).toBe(false);
      expect(result.completenessPercentage).toBe(67);
      expect(result.missing).toEqual(['billOfLading']);
    });

    it('handles complete checklist (100% complete, valid, 0 missing)', () => {
      const complete = {
        commercialInvoice: true,
        packingList: true,
        billOfLading: true,
      };

      const result = validateDocumentChecklist(complete);
      expect(result.valid).toBe(true);
      expect(result.completenessPercentage).toBe(100);
      expect(result.missing).toEqual([]);
    });

    it('handles null/undefined input gracefully as empty', () => {
      const result = validateDocumentChecklist(null);
      expect(result.valid).toBe(false);
      expect(result.completenessPercentage).toBe(0);
      expect(result.missing.length).toBe(3);
    });
  });
});
