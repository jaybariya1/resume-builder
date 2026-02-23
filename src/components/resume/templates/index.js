import Template1 from './Template1/Template1';
import Template2 from './Template2/Template2';
import Template3 from './Template3/Template3';
import Template4 from './Template4/Template4';
import Template5 from './Template5/Template5';

export const TEMPLATES = {
  modern: {
    id: 'modern',
    component: Template1,
    name: 'Classic',
    description: 'Clean black & white, ATS-friendly',
    accent: '#1e293b',
  },
  sidebar: {
    id: 'sidebar',
    component: Template2,
    name: 'Executive',
    description: 'Dark sidebar, two-column layout',
    accent: '#f97316',
  },
  elegant: {
    id: 'elegant',
    component: Template3,
    name: 'Elegant',
    description: 'Serif typography, purple accents',
    accent: '#7c3aed',
  },
  minimal: {
    id: 'minimal',
    component: Template4,
    name: 'Fresh',
    description: 'Green minimal with border accents',
    accent: '#16a34a',
  },
  traditional: {
    id: 'traditional',
    component: Template5,
    name: 'Traditional',
    description: 'Classic serif, date-left layout',
    accent: '#000000',
  },
};