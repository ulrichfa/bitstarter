#!/usr/bin/env node
var fs = require('fs');
var outfile = 'wh1.txt';
fs.writeFileSync(
  outfile,
  'A startup is a business built to grow rapidly.\n'
);
console.log("Script " + __filename + " wrote to " + outfile);

