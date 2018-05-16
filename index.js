const fs = require('fs');


// - write in node and without dependencies
// - each cell in the input csv includes a postfix notation (en.wikipedia.org/wiki/Reverse_Polish_notation)
// - numbers and operators are separated  by one or more spaces
// - a cell can refer to another cell via letter number notation (A2, B6 etc)
// - letters refer to columns, numbers to rows
// - support for + - * / math operators
// - cells that generate an error will print `ERR` but all other cells still do the deed
// - the app should print the output to stdout (no need to save new file)

const parser = function () {
	const data = fs.readFileSync('./test.csv').toString();
	console.log(data);
	const rowArray = data.split('\n');
	console.log(rowArray);
	let i = 0;
	const cellArray = rowArray.reduce((obj, row) => {
		let key = String.fromCharCode(97 + i);
		console.log('KEY:', key);
		const cells = row.split(',');
		cells.forEach((c, i) => {
			// console.log(c);
			obj[`${key}${i + 1}`] = c;
		})
		i++;
		return obj;
	}, {});
	resolveCellData(cellArray);
}

parser();
