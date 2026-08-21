"use client";

import React from 'react'
import { AnimatedSection } from '@/components/ui/Reveal';
import type { Page } from '@/payload-types'
import { m as motion } from "framer-motion"

type Props = Extract<NonNullable<Page['layout']>[0], { blockType: 'thesis' }>

export const ThesisBlock: React.FC<Props> = (props) => {
  const eyebrow = props.eyebrow || "[ THE EXVORTA\nTHESIS ]";
  const headline = props.headline || "The era of the digital brochure is dead. A generic website signals operational weakness to global partners. We engineer assets with a balance sheet impact.";
  const paragraphs = props.paragraphs && props.paragraphs.length > 0 ? props.paragraphs : [
    { text: "In the high-stakes arena of global trade, your digital footprint is your most heavily scrutinized asset. Before a contract is signed, before a container is shipped, serious buyers verify your credibility online before they ever reach out." },
    { text: "We established Exvorta to provide elite trading firms with digital infrastructure that matches their physical scale. No templates. No shortcuts. Just pure, unadulterated performance architecture." }
  ];

  return (
    <AnimatedSection className="w-full bg-[#FCFAF8] py-32 md:py-48 px-6">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Left Column: The Anchor */}
        <div className="lg:col-span-3 flex flex-col justify-start">
          <div className="w-12 h-[1px] bg-black/20 mb-8"></div>
          {eyebrow && (
            <span 
              className="text-[10px] font-mono tracking-[0.2em] text-black/40 uppercase leading-relaxed"
              dangerouslySetInnerHTML={{ __html: eyebrow.replace(/\n/g, '<br/>') }}
            />
          )}
        </div>
        {/* Right Column: The Manifesto */}
        <div className="lg:col-span-9 flex flex-col justify-center">
          {headline && (
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-black leading-[1.1] tracking-tight mb-12 max-w-4xl"
              dangerouslySetInnerHTML={{ __html: headline.replace(/\n/g, '<br/>') }}
            />
          )}
          {paragraphs.map((p, idx) => (
            <motion.p 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`text-xl text-black/60 font-sans leading-relaxed max-w-3xl ${idx !== paragraphs.length - 1 ? 'mb-8' : ''}`}
            >
              {p.text}
            </motion.p>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

export default ThesisBlock