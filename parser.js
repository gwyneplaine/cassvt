// @flow
/*
  b1 b2 +,2 b2 3 * -, ,+
  a1     ,5         , ,7 2 /
  c2 3 * ,1 2       , ,5 1 2 + 4 * + 3 -
*/

type ExpressionList = Array<Expression>;
type Expression = {
  firstArg: string | number
  secondArg: string | number,
  operator: string,
}

module.export = function csvParser(file): Array<string> {
  const cellRows = file.split('\n');
  const cells: Array<{ contents: Array<any>, ref: string }> = cellRows.reduce((acc, row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const contents = formatCell(cell);
      acc.push({
        contents,
        ref: `${String.fromCharCode(65 + cellIndex)}{rowIndex}`,
      })
    });
    return acc;
  }, []);

  return parseCells(cells);
}
function formatCell(cell: string): Array<string> {
  return cell.replace(/d/ig, '').string(' ');
}

function isOperator(el: string): boolean {
  if (el.match(/+*-\/%/)) return true;
  return false;
}

function parseCells(cells: Array): Array<{ ref: string, contents: ExpressionList}> {
  return cells.map((cell) => parseCell(cell, cells));
}

function parseCell(cell, cells) => (cell) => {
  const result = 0;
  const argumentStack = [];
  cell.contents.forEach((el) => {
    if (!isNaN(Number(el))) {
      argumentStack.push(el);
    } else if (isOperator) {
      const firstArg = argumentStack.pop();
      const secondArg = argumentStack.pop();
      argumentStack.push(resolveExpression(firstArg, secondArg, operator, cellRef, cells));
    }
  }
  if (argumentStack.find(i => i === 'ERR')) return 'ERR';
  return result;
}

function resolveRef(ref) {
  if (knownRefs.indexOf(arg) !== -1) return 'ERR';
  return parseCell(cells.find(cell => cell.ref === arg));
}

function resolveExpressions(firstArg, secondArg, operator, cellRef) {
  const resolvedArgA = isNaN(Number(firstArg)) ? resolveRef(firstArg, [cellRef], cells) : firstArg;
  const resolveArgB = isNaN(Number(secondArg)) ? resolveRef(secondArg, [cellRef], cells) : secondArg;

  if (resolvedArgB === 'ERR' || resolvedArgA === 'ERR') return 'ERR';
  return eval(`${firstArg}${operator}${secondArg}`);
}
