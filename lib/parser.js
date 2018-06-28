//
/*
  b1 b2 +,2 b2 3 * -, ,+
  a1     ,5         , ,7 2 /
  c2 3 * ,1 2       , ,5 1 2 + 4 * + 3 -
*/





let argumentStack = [];

module.exports = function csvParser(file) {
  const cellRows = file.split('\n');
  const cells = cellRows.reduce((acc, row, rowIndex) => {
    row.split(',').forEach((cell, cellIndex) => {
      const contents = formatCell(cell);
      acc.push({
        contents,
        ref: `${String.fromCharCode(97 + rowIndex)}${cellIndex + 1}`,
      })
    });
    return acc;
  }, []);

  return parseCells(cells);
}
function formatCell(cell) {
  const splitCell = cell.replace(/(\s+)/ig, ' ').trim().split(' ');
	return splitCell.length === 1 && !splitCell[0] ? ['ERR'] : splitCell;
}

function isOperator(el) {
  if (el.match(/\+|\*|\/|\%|-/)) return true;
  return false;
}

function parseCells(cells) {
	const parseFn = parseCell(cells);
	console.log(cells);
  return cells.map((cell) => {
		parseCell(cells, cell)
	});
};



function parseCell (cells, cell, knownRefs) {
  const result = 0;
	let ref = knownRefs || [];
  cell.contents.forEach((el) => {
   if (isOperator(el)) {
      const firstArg = argumentStack.pop();
      const secondArg = argumentStack.pop();
			const result = resolveExpressions(firstArg, secondArg, el, cell.ref, cells, knownRefs);
			console.log('parseCell, RESULT: ', result);
      argumentStack.push(result);
    } else {
			argumentStack.push(el);
		}
  });

	if (argumentStack.find(i => i === 'ERR')) {
		argumentStack = [];
		return 'ERR';
	} else {
		argumentStack = [];
		return result;
	}
}

function resolveRef(ref, knownRefs, cells) {
	console.log(knownRefs, ref);
  if (knownRefs.indexOf(ref) !== -1) return 'ERR';
	const cell = cells.find(cell => cell.ref === ref);
	console.log('resolveRef cell', cell);
  return parseCell(cells)(cell);
}

function resolveExpressions(firstArg, secondArg, operator, cellRef, cells) {
	console.log('resolveExpression', firstArg, secondArg, operator);
  const resolvedArgA = isNaN(Number(firstArg)) ? resolveRef(firstArg, cellRef, cells) : firstArg;
  const resolvedArgB = isNaN(Number(secondArg)) ? resolveRef(secondArg, cellRef, cells) : secondArg;

  if (resolvedArgB === 'ERR' || resolvedArgA === 'ERR') return 'ERR';
  return eval(`${resolvedArgA}${operator}${resolvedArgB}`);
}
