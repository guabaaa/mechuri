import { ALL_MENUS, DELIVERY_MENUS } from '../data/menus';
import {
  getRecipe,
  hasDetailedRecipe,
  listRecipeMenus,
  type Recipe,
} from '../data/recipes';

export type RecipeSummary = {
  menu: string;
  summary: string;
  prepMinutes: number;
  hasDetail: boolean;
};

export function getAllRecipeSummaries(): RecipeSummary[] {
  const menus = new Set<string>([
    ...listRecipeMenus(),
    ...ALL_MENUS,
    ...DELIVERY_MENUS,
  ]);

  return [...menus]
    .sort((a, b) => a.localeCompare(b, 'ko'))
    .map((menu) => {
      const recipe = getRecipe(menu);
      return {
        menu,
        summary: recipe.summary,
        prepMinutes: recipe.prepMinutes,
        hasDetail: hasDetailedRecipe(menu),
      };
    });
}

export function lookupRecipe(menu: string): Recipe | null {
  const trimmed = menu.trim();
  if (!trimmed) {
    return null;
  }
  return getRecipe(trimmed);
}
