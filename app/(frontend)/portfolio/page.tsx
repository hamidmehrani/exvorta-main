import React from 'react';
import type { Metadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { PortfolioArchiveBlock } from '@/components/blocks/PortfolioArchiveBlock';
import type { Project } from '@/payload-types';

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({ title: 'Portfolio', description: 'Latest Web Design Works. Premium websites and CMS platforms engineered for global exporters.' })
}

export default function PortfolioArchivePage() {
  const projects = [
    {
      id: '1',
      title: 'Nutave',
      slug: 'nutave',
      metrics: [
        { label: 'INDUSTRY', value: 'PREMIUM NUTS', id: 'm1' },
        { label: 'STACK', value: 'B2B WEB DEVELOPMENT', id: 'm2' }
      ],
      heroImage: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLu8-HNcmaGLnw2_KpZEj7jBld8fDlt0SdaiSex0wQyclFjJr3_pfzfGiS-UJwjSRGSqNl_XvglFmgNXkjVq7PbaYEfBg2fL6LPYB90N4aqXLpgb5ySkEzz9x0nGed182i___J7x-3lr4QbBY6YPjoZN5Llfc5QRBvPN7Xzt7ND8VcGxX7cmAEfda-xXA8TrxumBKPGKzSQ0LW1LKyfwkmcKjhHXelxyyoy6sPGbvGog1EtVoXTLmwkdW0c',
        alt: 'Nutave'
      },
      meta: { description: 'Precision nut processing and distribution for global wholesale partners.' },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as unknown as Project,
    {
      id: '2',
      title: 'Spicevo',
      slug: 'spicevo',
      metrics: [
        { label: 'INDUSTRY', value: 'ORGANIC HERBS', id: 'm3' },
        { label: 'STACK', value: 'WEB DESIGN & CMS', id: 'm4' }
      ],
      heroImage: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLsluHrudtzDaG50aSD36NdRzN58w6vb8tMpFOdnfIZFgY1dBgREUPWYQlTjj9EbRdLgnplkZYewTF9sMmaeJSXAK3oto-ygLUZfgwWyy7yWx7KwCDhAFMeuV49Vhkho1reIvl0I9GKNryk-9aFBdjJS583MJmCtZCneN1ZtU54xdaArh6k8eLfsYFLn5M0d_X1KdW11WwN2Sz8g_rTEjmd88-HJHGcuK3mzWuDZmmpB05aQ3niGkBjgHbc',
        alt: 'Spicevo'
      },
      meta: { description: 'Certified organic herbs supply chain for European premium markets.' },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as unknown as Project,
    {
      id: '3',
      title: 'Stonvi',
      slug: 'stonvi',
      metrics: [
        { label: 'INDUSTRY', value: 'CERAMICS', id: 'm5' },
        { label: 'STACK', value: 'CORPORATE WEBSITE & CMS', id: 'm6' }
      ],
      heroImage: {
        url: 'https://lh3.googleusercontent.com/aida/AP1WRLu2S7JLA2CjBYFpiSTcthdBBImg8NlO3gtp4silpS9I1v5xotd5HAg8Ahc2NhLGqufRvXBAZ5pivolwV24QdbIQ-8hKG-kOVJFkvs3ob81hCSG0Wt1yZ_o1LIN_s0_i37HHWHnnV_z8Jwb82qyWOkodIAJa85QJB8NCmNnHegI9LeTFsAaQBSi7Zjh6PT1YR-kCYbMsx7wjTR5d2RZYF-ebc-TMhnaVA6nQy0ztdzS6II91HHsgpZYiuw8',
        alt: 'Stonvi'
      },
      meta: { description: 'High-end ceramic and stone materials for international architectural projects.' },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as unknown as Project,
  ];

  return <PortfolioArchiveBlock projects={projects} fullPage={true} />;
}
