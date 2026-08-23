'use client';
import React from 'react';
import type { Project } from '@/payload-types';
import ProjectThemedLayout from './ProjectThemedLayout';

export function ProjectSingleLayout({ project }: { project?: Project }) {
  return <ProjectThemedLayout project={project} />;
}

export default ProjectSingleLayout;
