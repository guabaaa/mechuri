import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ALL_MENUS } from './data/menus';
import { getAllRecipeSummaries, lookupRecipe } from './services/recipeService';

describe('recipeService', () => {
  it('lists recipes for expanded menu pool', () => {
    const list = getAllRecipeSummaries();
    assert.ok(list.length >= ALL_MENUS.length);
  });

  it('returns recipe for known menu', () => {
    const recipe = lookupRecipe('김치찌개');
    assert.ok(recipe);
    assert.equal(recipe!.menu, '김치찌개');
    assert.ok(recipe!.steps.length >= 2);
  });

  it('returns generic recipe for unknown menu', () => {
    const recipe = lookupRecipe('메추리볶음');
    assert.ok(recipe);
    assert.match(recipe!.summary, /메추리볶음/);
  });
});
