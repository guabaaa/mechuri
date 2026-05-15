import {
  buildLadder,
  generateRowBridges,
  hasAdjacentBridges,
  tracePath,
  winnerMenu,
} from '../../src/utils/ladderGame';

describe('ladderGame', () => {
  it('returns a winner within item list', () => {
    const items = ['A', 'B', 'C', 'D'];
    const layout = buildLadder(items, 42);
    const winner = winnerMenu(layout);
    expect(items).toContain(winner);
    expect(layout.path.length).toBe(layout.rows + 1);
  });

  it('never places adjacent bridges on the same row', () => {
    const layout = buildLadder(['치킨', '피자', '라면', '초밥', '떡볶이'], 99);
    for (const row of layout.bridges) {
      expect(hasAdjacentBridges(row)).toBe(false);
    }
  });

  it('path matches bridge traversal', () => {
    const items = ['A', 'B', 'C'];
    const layout = buildLadder(items, 7);
    const traced = tracePath(layout.bridges, layout.startCol);
    expect(traced).toEqual(layout.path);
  });

  it('produces different bridges with different seeds', () => {
    const items = ['치킨', '피자', '라면'];
    const a = buildLadder(items, 1);
    const b = buildLadder(items, 2);
    expect(a.bridges).not.toEqual(b.bridges);
  });

  it('generateRowBridges avoids touching rungs', () => {
    const row = generateRowBridges(6, () => 0.5);
    expect(hasAdjacentBridges(row)).toBe(false);
  });
});
