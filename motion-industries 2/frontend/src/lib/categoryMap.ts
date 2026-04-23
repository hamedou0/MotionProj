export const CATEGORY_MAP: Record<string, string[]> = {
  'Bearings':             ['MRO Solutions'],
  'Belts':                ['MRO Solutions'],
  'Chain':                ['MRO Solutions'],
  'Motors':               ['MRO Solutions'],
  'Couplings':            ['MRO Solutions'],
  'Electrical':           ['MRO Solutions'],
  'Plumbing':             ['MRO Solutions'],
  'Hydraulics':           ['MRO Solutions'],
  'Hose & Fittings':      ['MRO Solutions'],
  'Pneumatics':           ['MRO Solutions'],
  'Lubricants':           ['MRO Solutions', 'Facility Essentials'],
  'Facility Maintenance': ['Facility Essentials'],
  'Safety':               ['Safety'],
};

export const UI_CATEGORIES = ['MRO Solutions', 'Facility Essentials', 'Safety', 'Other'] as const;
export type UICategory = typeof UI_CATEGORIES[number];

export function getUICategories(dbCategory: string): UICategory[] {
  return (CATEGORY_MAP[dbCategory] ?? ['Other']) as UICategory[];
}

export function matchesUICategory(dbCategory: string, filter: UICategory): boolean {
  return getUICategories(dbCategory).includes(filter);
}
