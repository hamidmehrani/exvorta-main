import React from 'react';
import { Container } from '@/components/ui/Container';

export default function Loading() {
  return (
    <main className="w-full bg-brand-cream min-h-screen">
      <div className="w-full pt-32 pb-24">
        <Container>
          <div className="max-w-5xl">
            <div className="w-24 h-4 bg-brand-obsidian/10 rounded mb-6 animate-pulse"></div>
            <div className="w-3/4 h-24 bg-brand-obsidian/10 rounded mb-8 animate-pulse"></div>
            <div className="w-1/2 h-8 bg-brand-obsidian/10 rounded animate-pulse"></div>
          </div>
        </Container>
      </div>
      <div className="w-full border-b-2 border-brand-obsidian/10"></div>
      <section className="w-full flex flex-col bg-brand-cream">
        {[1, 2].map((i) => (
          <article key={i} className="w-full border-b border-brand-obsidian/10 py-24">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 lg:gap-8 items-center">
                <div className="lg:col-span-4 flex flex-col space-y-12">
                  <div>
                    <div className="w-full h-16 bg-brand-obsidian/10 rounded mb-4 animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-brand-obsidian/10 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-40 h-12 bg-brand-obsidian/10 rounded animate-pulse"></div>
                    <div className="w-40 h-12 bg-brand-obsidian/10 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="lg:col-span-6 w-full aspect-[16/9] bg-brand-obsidian/5 animate-pulse rounded-lg"></div>
              </div>
            </Container>
          </article>
        ))}
      </section>
    </main>
  );
}
