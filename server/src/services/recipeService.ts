import { ALL_MENUS } from '../data/menus';
import { DELIVERY_BRANDS } from '../data/deliveryBrands';
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

const DELIVERY_BRAND_SET = new Set<string>(DELIVERY_BRANDS);

export function getAllRecipeSummaries(): RecipeSummary[] {
  const menus = new Set<string>([...listRecipeMenus(), ...ALL_MENUS]);

  return [...menus]
    .filter((menu) => !DELIVERY_BRAND_SET.has(menu))
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
