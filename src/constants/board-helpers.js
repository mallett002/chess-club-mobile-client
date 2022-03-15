const inverseObject = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    newObj[obj[key]] = key;
  });

  return newObj;
};

export const PIECES = {
  r: 'chess-rook',
  n: 'chess-knight',
  b: 'chess-bishop',
  q: 'chess-queen',
  k: 'chess-king',
  p: 'chess-pawn'
};

export const indexToRank = {
  0: 8,
  1: 7,
  2: 6,
  3: 5,
  4: 4,
  5: 3,
  6: 2,
  7: 1,
 }
 
 export const indexToFile = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
 };

 export const fileToIndex = inverseObject(indexToFile);

 export function getIndexForLabel(positions, label) {
  let index;

  for (let i = 0; i < positions.length; i++) {
    const cell = positions[i];

    if (cell.label === label) {
      index = i;
      break;
    }
  }

  return index;
}