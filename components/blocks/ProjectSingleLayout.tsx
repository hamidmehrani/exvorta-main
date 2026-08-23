'use client';
import React from 'react';
import type { Project } from '@/payload-types';
import ProjectSpicevo from './ProjectSpicevo';
import ProjectNutave from './ProjectNutave';
import ProjectStonvi from './ProjectStonvi';
import { Container } from '@/components/ui/Container';

export function ProjectSingleLayout({ project }: { project?: Project }) {
  const slug = project?.slug || '';
  
  if (slug.includes('spicevo') || slug.includes('aurora')) {
    return <ProjectSpicevo project={project} />;
  }
  
  if (slug.includes('nutave') || slug.includes('vanguard')) {
    return <ProjectNutave project={project} />;
  }
  
  if (slug.includes('stonvi')) {
    return <ProjectStonvi project={project} />;
  }
  
  // Fallback to Stonvi if totally unknown
  return <ProjectStonvi project={project} />;

  // Fallback if generic project slug
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen flex items-center justify-center">
      <Container className="text-center">
        <h1 className="text-4xl font-serif mb-4">{project?.title || 'Project'}</h1>
        <p className="text-white/60 font-mono text-sm tracking-widest">[ PROJECT RENDERER UNAVAILABLE FOR THIS SLUG ]</p>
      </Container>
    </div>
  );
}

export default ProjectSingleLayout;
