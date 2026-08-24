export const CATEGORY_COLORS: Record<string, string> = {
  Education: '#8B5CF6',
  Shopping: '#F59E0B',
  Housing: '#3B82F6',
  Healthcare: '#EF4444',
  Other: '#64748B',
  Food: '#10B981',
  Transport: '#06B6D4',
  Entertainment: '#EC4899',
};

// Secondary palette for custom categories
export const SECONDARY_PALETTE = [
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#EAB308', // Yellow
  '#F97316', // Orange
];

// In-session cache for custom categories to preserve color mapping during session
const customCategoryCache: Record<string, string> = {};

/**
 * Returns the color assigned to a spending category.
 * If the category is custom, it retrieves or assigns a unique color from the secondary palette.
 */
export function getCategoryColor(category: string): string {
  // Normalize category name for case insensitivity
  const normalized = category.trim();

  // 1. Check standard colors
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return color;
    }
  }

  // 2. Check session cache for custom categories
  if (customCategoryCache[normalized]) {
    return customCategoryCache[normalized];
  }

  // 3. Assign new color
  const usedCount = Object.keys(customCategoryCache).length;
  const color = SECONDARY_PALETTE[usedCount % SECONDARY_PALETTE.length];
  customCategoryCache[normalized] = color;
  
  return color;
}
