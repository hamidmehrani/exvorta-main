/**
 * Shared admin panel configuration — identical structure across all projects.
 * Only the values below change per brand.
 *
 * Fields:
 * - brandLetter: single letter shown in the logo tile / favicon icon
 * - brandName:   full name shown next to the logo and in the welcome widget
 * - accent:      brand accent color (hex) used across admin UI
 * - background:  admin background color (hex)
 * - text:        primary text color (hex)
 * - tagline:     one-line description under the brand name
 * - quickActions: dashboard shortcuts (Payload admin paths)
 */

export interface QuickAction {
  label: string
  href: string
}

export interface AdminPanelConfig {
  brandLetter: string
  brandName: string
  accent: string
  background: string
  text: string
  tagline: string
  quickActions: QuickAction[]
}

export const adminPanelConfig: AdminPanelConfig = {
  brandLetter: 'E',
  brandName: 'EXVORTA OS',
  accent: '#00FF66',
  background: '#0A0A0A',
  text: '#E5E5E5',
  tagline: 'Welcome to the Exvorta infrastructure terminal.',
  quickActions: [
    { label: 'Manage Pages', href: '/admin/collections/pages' },
    { label: 'Update Portfolio', href: '/admin/collections/projects' },
    { label: 'Configure Navigation', href: '/admin/globals/navigation' },
    { label: 'Site Settings', href: '/admin/globals/site-settings' },
  ],
}

export default adminPanelConfig
