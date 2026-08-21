import React from 'react';
import { Container } from '@/components/ui/Container';
import { Hairline } from '@/components/ui/Hairline';

export default function Loading() {
  return (
    <div className="w-full flex flex-col z-10 relative bg-[#FCFAF8]">
      <section className="w-full bg-[#0A0A0A] pt-40 pb-20 px-6 relative overflow-hidden">
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="w-40 h-4 bg-white/10 rounded mb-8 animate-pulse block"></div>
          <div className="w-3/4 h-24 bg-white/10 rounded mb-8 animate-pulse"></div>
          <div className="w-1/2 h-6 bg-white/10 rounded mb-16 animate-pulse"></div>
          
          <div className="w-full max-w-4xl pt-8 flex flex-wrap justify-center gap-4 border-t border-white/10">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-24 h-10 bg-white/10 rounded animate-pulse"></div>)}
          </div>
        </Container>
      </section>
      <Hairline className="bg-white/10 w-full" />
      
      <section className="w-full py-24 px-6">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full aspect-[16/10] bg-black/[0.03] rounded-xl border border-black/5 animate-pulse"></div>
          <div className="flex flex-col">
            <div className="w-20 h-4 bg-black/[0.05] rounded mb-6 animate-pulse"></div>
            <div className="w-full h-12 bg-black/[0.06] rounded mb-4 animate-pulse"></div>
            <div className="w-3/4 h-12 bg-black/[0.06] rounded mb-8 animate-pulse"></div>
            <div className="w-full h-4 bg-black/[0.03] rounded mb-3 animate-pulse"></div>
            <div className="w-5/6 h-4 bg-black/[0.03] rounded mb-10 animate-pulse"></div>
            <div className="w-40 h-12 bg-black/[0.05] rounded animate-pulse"></div>
          </div>
        </Container>
      </section>
    </div>
  );
}
