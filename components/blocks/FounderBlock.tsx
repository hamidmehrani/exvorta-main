"use client";

import React from 'react';
import { AnimatedSection } from '@/components/ui/Reveal';
// import Image from 'next/image';
import { m as motion } from "framer-motion";

export interface FounderBlockProps {
  eyebrow?: string;
  quote?: string;
  name?: string;
  bio?: string;
  roleTitle?: string;
  roleCompany?: string;
  imageSrc?: string;
  imageAlt?: string;
  [key: string]: any;
}

export const FounderBlock: React.FC<FounderBlockProps> = (props) => {
  const eyebrow = props.eyebrow || "[ 04. THE FOUNDER ]";
  const quote = props.quote || "\"Architecture is not just visual; it is a balance sheet asset. We engineer digital gravity for the world's most demanding trade entities.\"";
  const name = props.name || "Hamid Mehrani";
  const bio = props.bio || "Based in Dubai. Background in digital engineering and international trade operations. Founded Exvorta to bridge the credibility gap facing global trading firms.";
  const roleTitle = props.roleTitle || "HAMID MEHRANI";
  const roleCompany = props.roleCompany || "PRINCIPAL ARCHITECT, EXVORTA";
  const imageSrc = props.imageSrc || "https://lh3.googleusercontent.com/aida/AP1WRLuCABArA0dFLPr7X-kzVh0ePxOiRBVUP80aMVLCo4Zm4Ag2EAEoleoHyv0zWqpOnKnbtnsp02fwaS4F40nXwEtHwo6Hu37pR0UyHPVeXKTKGCk1JgsgwSz0hJbZz5DCEqEuCjqHpnaD22poW7CaU5XQdjCPR66D6sQgWW8JrlQDhNZRuAOZUQKKBc5gsUC-uogWXb3IaFvVe96wEpHZC0o7uvK3SdERtz23Ob1kTgrgftxXjgLLYQOXdFw";
  const imageAlt = props.imageAlt || "Hamid Mehrani, Principal Architect";

  return (
    <AnimatedSection className="w-full py-32 relative overflow-hidden bg-white text-black" id="founder">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col min-h-[40vh] bg-transparent">
        <span className="text-xs font-mono tracking-widest text-black/40 uppercase">
          {eyebrow}
        </span>
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 w-full items-center">
          {/* Left Column: Editorial Quote & Signature */}
          <div className="lg:col-span-3 flex flex-col pr-16">
            <motion.blockquote 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-black leading-tight mb-12 italic" 
              dangerouslySetInnerHTML={{ __html: quote }} 
            />
            <div className="mt-4">
              <div className="font-serif italic text-3xl text-black mb-4">{name}</div>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-sans leading-relaxed text-black/60 mb-3 max-w-md">
                  {bio}
                </p>
                <span className="text-[10px] font-mono tracking-[0.3em] text-black/60 uppercase">{roleTitle}</span>
                <span className="text-[10px] font-mono tracking-[0.3em] text-black/40 uppercase">{roleCompany}</span>
              </div>
            </div>
          </div>
          {/* Right Column: Portrait */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4] w-full overflow-hidden border border-black/10 rounded-none shadow-none mt-16 lg:mt-0"
            >
              <motion.img 
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                alt={imageAlt} 
                className="w-full h-full object-cover grayscale contrast-125 rounded-none" 
                src={imageSrc}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FounderBlock;
