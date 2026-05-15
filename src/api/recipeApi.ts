import { apiRequest } from './client';
import type { Recipe, RecipeSummary } from './types';

export function fetchRecipeList() {
  return apiRequest<RecipeSummary[]>('/api/v1/recipes');
}

export function fetchRecipe(menu: string) {
  const q = encodeURIComponent(menu);
  return apiRequest<Recipe>(`/api/v1/recipes/detail?menu=${q}`);
}
