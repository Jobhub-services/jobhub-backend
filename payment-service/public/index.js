const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3020;

app.get('/', (req, res) => {
	const file = fs.readFileSync(path.resolve(__dirname, 'tap-simulation.html'), 'ascii');
	res.send(file);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
