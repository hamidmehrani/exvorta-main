import { describe, it, expect } from 'vitest'
import { unbracket } from './text'

describe('unbracket', () => {
  it('strips enclosing brackets with surrounding or inner whitespace', () => {
    expect(unbracket('[ ENGINE V1.0 LIVE ]')).toBe('ENGINE V1.0 LIVE')
    expect(unbracket('[LIVE]')).toBe('LIVE')
    expect(unbracket('  [ STATUS ACTIVE ]  ')).toBe('STATUS ACTIVE')
    expect(unbracket(' [STATUS ACTIVE] ')).toBe('STATUS ACTIVE')
  })

  it('handles null, undefined, and empty string', () => {
    expect(unbracket(null)).toBe('')
    expect(unbracket(undefined)).toBe('')
    expect(unbracket('')).toBe('')
    expect(unbracket('   ')).toBe('')
  })

  it('leaves unbracketed text intact while trimming surrounding whitespace', () => {
    expect(unbracket('ENGINE V1.0 LIVE')).toBe('ENGINE V1.0 LIVE')
    expect(unbracket('  ENGINE V1.0 LIVE  ')).toBe('ENGINE V1.0 LIVE')
    expect(unbracket('SingleWord')).toBe('SingleWord')
  })

  it('preserves inner brackets when removing outer pair', () => {
    expect(unbracket('[[ DOUBLE ]]')).toBe('[ DOUBLE ]')
    expect(unbracket('[ [ NESTED ] ]')).toBe('[ NESTED ]')
  })

  it('handles solitary or mismatched bracket tokens correctly', () => {
    expect(unbracket('[')).toBe('')
    expect(unbracket(']')).toBe('')
    expect(unbracket('[]')).toBe('')
    expect(unbracket('[ ]')).toBe('')
    expect(unbracket('[ UNCLOSED')).toBe('UNCLOSED')
    expect(unbracket('UNOPENED ]')).toBe('UNOPENED')
    expect(unbracket('Hello [world] test')).toBe('Hello [world] test')
  })

  it('handles unicode, Persian text, numbers, and special characters', () => {
    expect(unbracket('[ نسخه آزمایشی ]')).toBe('نسخه آزمایشی')
    expect(unbracket('[سامانه صادرات]')).toBe('سامانه صادرات')
    expect(unbracket('[ #1 - $100 / 50% ]')).toBe('#1 - $100 / 50%')
    expect(unbracket('[ 123.456 ]')).toBe('123.456')
  })
})
