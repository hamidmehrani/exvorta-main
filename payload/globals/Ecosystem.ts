import { GlobalConfig } from 'payload'

export const Ecosystem: GlobalConfig = {
  slug: 'ecosystem',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '[ THE GLOBAL TRADE OPERATING SYSTEM ]' },
        { name: 'title', type: 'text', defaultValue: 'A Unifying Core.' },
        { name: 'subtitle', type: 'text', defaultValue: 'One OS for Global Trading Infrastructure.' },
        { name: 'description', type: 'textarea', defaultValue: 'We do not build isolated products. We engineer an integrated digital command center. From bespoke Web architectures to automated documentation and trade tracking, Exvorta merges Web, Docs, Track, CRM, and Intel into a single, cohesive operating system for global traders.' },
        { name: 'badge', type: 'text', defaultValue: '[ WEB · DOCS · TRACK · CRM · INTEL · SUITE ]' },
      ],
    },
    {
      name: 'problem',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '[ THE FRAGMENTATION PROBLEM ]' },
        { name: 'title', type: 'text', defaultValue: 'The modern trading entity is paralyzed by shattered software.' },
        { name: 'description', type: 'textarea', defaultValue: 'You use one vendor for a public website, another for client portals, and legacy systems for tracking. This fragmentation creates data silos, wasted hours, and decisions made on incomplete information. To scale globally, you do not need more apps. You need a singular, unified nervous system.' },
      ],
    },
    {
      name: 'products',
      type: 'array',
      fields: [
        { name: 'moduleTag', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'statusColor', type: 'select', options: ['emerald', 'black', 'white'] },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'subtext', type: 'textarea' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaLink', type: 'text' },
      ],
    },
    {
      name: 'vision',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'THE ULTIMATE VISION' },
        { name: 'title', type: 'text', defaultValue: 'Total Synthesis.' },
        { name: 'subtitle', type: 'text', defaultValue: 'The Exvorta Suite.' },
        { name: 'description', type: 'textarea', defaultValue: 'When Web, Docs, Track, CRM, and Intel converge, they cease to be individual tools. They become a singular, unbreachable digital nervous system. This is the Exvorta Suite: the absolute apex of global trade infrastructure.' },
      ],
    },
    {
      name: 'roadmap',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '[ DEPLOYMENT SCHEDULE ]' },
        { name: 'title', type: 'text', defaultValue: 'The Infrastructure Roadmap.' },
        {
          name: 'timeline',
          type: 'array',
          fields: [
            { name: 'phase', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ]
        }
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: '[ INITIATE PARTNERSHIP ]' },
        { name: 'title', type: 'text', defaultValue: 'Secure your digital foundation.' },
        { name: 'subtitle', type: 'text', defaultValue: 'Unlock the ecosystem.' },
        { name: 'description', type: 'textarea', defaultValue: 'Alpha access to Exvorta Docs and Track is strictly prioritized for our active web architecture clients. Upgrade your public infrastructure today to guarantee your position in the future of global trade.' },
        { name: 'primaryCtaText', type: 'text', defaultValue: '[ UPGRADE WEB ARCHITECTURE ]' },
        { name: 'primaryCtaLink', type: 'text', defaultValue: '/proposal' },
        { name: 'secondaryCtaText', type: 'text', defaultValue: '[ JOIN SOFTWARE WAITLIST ]' },
        { name: 'secondaryCtaLink', type: 'text', defaultValue: '/waitlist' },
        { name: 'disclaimer', type: 'text', defaultValue: '* Web proposals are subject to capacity constraints.' },
      ],
    }
  ]
}

export default Ecosystem
