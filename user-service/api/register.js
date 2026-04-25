'use strict';
// Patches Node module resolution so @/ maps to src/ before any service code loads.
const path = require('path');
const Module = require('module');

const srcDir = path.resolve(__dirname, '..', 'src');
const _resolveFilename = Module._resolveFilename.bind(Module);

Module._resolveFilename = function (request, parent, isMain, options) {
	if (typeof request === 'string' && request.startsWith('@/')) {
		request = path.join(srcDir, request.slice(2));
	}
	return _resolveFilename(request, parent, isMain, options);
};
