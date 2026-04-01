import Template1 from './Template1/Template1';
import Template2 from './Template2/Template2';
import Template3 from './Template3/Template3';
import Template4 from './Template4/Template4';
import Template5 from './Template5/Template5';
import Template6 from './Template6/Template6';
import Template7 from './Template7/Template7';
import Template8 from './Template8/Template8';
import Template9 from './Template9/Template9';

export const TEMPLATES = {
  modern: {
    id: 'modern',
    component: Template1,
    name: 'Classic',
    description: 'Clean black & white, ATS-friendly',
    accent: '#1e293b',
    supportsPhoto: false,
  },
  sidebar: {
    id: 'sidebar',
    component: Template2,
    name: 'Executive',
    description: 'Dark sidebar, two-column layout',
    accent: '#f97316',
    supportsPhoto: true,
  },
  elegant: {
    id: 'elegant',
    component: Template3,
    name: 'Elegant',
    description: 'Serif typography, purple accents',
    accent: '#7c3aed',
    supportsPhoto: true,
  },
  minimal: {
    id: 'minimal',
    component: Template4,
    name: 'Fresh',
    description: 'Green minimal with border accents',
    accent: '#16a34a',
    supportsPhoto: false,
  },
  traditional: {
    id: 'traditional',
    component: Template5,
    name: 'Traditional',
    description: 'Classic serif, date-left layout',
    accent: '#000000',
    supportsPhoto: false,
  },
  impact: {
    id: 'impact',
    component: Template6,
    name: 'Impact',
    description: 'Bold gold accent with icon section headers',
    accent: '#d4a017',
    supportsPhoto: false,
  },
  timeline: {
    id: 'timeline',
    component: Template7,
    name: 'Timeline',
    description: 'Green accent, clean date-left layout',
    accent: '#22c55e',
    supportsPhoto: false,
  },
  helsinki: {
    id: 'helsinki',
    component: Template8,
    name: 'Helsinki',
    description: 'Two-column sidebar with photo support',
    accent: '#1a1a1a',
    supportsPhoto: true,
  },
  academic: {
    id: 'academic',
    component: Template9,
    name: 'Academic',
    description: 'Serif, dot-rated skills, classic layout',
    accent: '#000000',
    supportsPhoto: false,
  },
};
