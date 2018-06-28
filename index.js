const fs = require('fs');
const parser = require('./parser');

// - write in node and without dependencies
// - each cell in the input csv includes a postfix notation (en.wikipedia.org/wiki/Reverse_Polish_notation)
// - numbers and operators are separated  by one or more spaces
// - a cell can refer to another cell via letter number notation (A2, B6 etc)
// - letters refer to columns, numbers to rows
// - support for + - * / math operators
// - cells that generate an error will print `ERR` but all other cells still do the deed
// - the app should print the output to stdout (no need to save new file)

const data = fs.readFileSync('./test.csv').toString();
parser(data);
