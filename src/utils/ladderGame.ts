export type LadderLayout = {
  items: string[];
  rows: number;
  /** bridges[row][col] = col번·col+1번 세로선 사이 가로줄 */
  bridges: boolean[][];
  startCol: number;
  winnerCol: number;
  /** 각 가로 단(row) 지나며 도착한 세로선 인덱스. length = rows + 1 */
  path: number[];
};

function createRng(seed?: number) {
  let s = (seed ?? Date.now()) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 같은 줄에 인접한 가로줄이 없도록 한 줄 생성 */
export function generateRowBridges(cols: number, rand: () => number): boolean[] {
  const row = Array.from({ length: cols - 1 }, () => false);
  let i = 0;
  while (i < cols - 1) {
    if (rand() < 0.42) {
      row[i] = true;
      i += 2;
    } else {
      i += 1;
    }
  }
  return row;
}

export function hasAdjacentBridges(row: boolean[]): boolean {
  for (let i = 0; i < row.length - 1; i += 1) {
    if (row[i] && row[i + 1]) {
      return true;
    }
  }
  return false;
}

export function tracePath(
  bridges: boolean[][],
  startCol: number,
): number[] {
  const path: number[] = [startCol];
  let col = startCol;

  for (let row = 0; row < bridges.length; row += 1) {
    const rowBridges = bridges[row]!;
    if (rowBridges[col - 1]) {
      col -= 1;
    } else if (rowBridges[col]) {
      col += 1;
    }
    path.push(col);
  }

  return path;
}

export function buildLadder(items: string[], seed?: number): LadderLayout {
  const n = items.length;
  if (n < 2) {
    throw new Error('메뉴는 2개 이상 필요해요.');
  }

  const rand = createRng(seed);
  const rows = Math.max(8, n * 2);
  const bridges = Array.from({ length: rows }, () =>
    generateRowBridges(n, rand),
  );

  const startCol = Math.floor(rand() * n);
  const path = tracePath(bridges, startCol);
  const winnerCol = path[path.length - 1]!;

  return {
    items,
    rows,
    bridges,
    startCol,
    winnerCol,
    path,
  };
}

export function winnerMenu(layout: LadderLayout): string {
  return layout.items[layout.winnerCol]!;
}

/** row 단계에서 사용된 가로줄 인덱스 (없으면 null) */
export function bridgeAtRow(
  layout: LadderLayout,
  row: number,
): number | null {
  const from = layout.path[row]!;
  const to = layout.path[row + 1]!;
  if (from === to) {
    return null;
  }
  return Math.min(from, to);
}
