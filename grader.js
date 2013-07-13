#!/usr/bin/env node
/*
 * Automatically grade files for the presence of specified HTML tags/attributes. 
 * Uses commander.js and ceerio. 
 * Teaches command line application development and basic DOM parsing. 
 *
 * References: 

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

// common variables
var fs = require('fs');
var program = require('commander');
var restler = require('restler');
var cheerio = require('cheerio');
var CHECKSFILE_DEFAULT = "checks.json";
var startedOnCLI = false;

// checks the existance of a file named in the command parms
var assertFileExists = function( infile ) {
    // console.log( 'assert file: ' + infile );
    var instr = infile.toString();
    if( !fs.existsSync(instr) ) {
        console.log( "%s does not exist. Exiting.", instr );
        process.exit(1);
    }
    return instr;
};

// use restler to load a file given its URL
var cheerioHtmlUrl = function( htmlurl ) {
};

var loadChecks = function( checksfile ) {
    return JSON.parse( fs.readFileSync( checksfile ));
};

// obtains the HTML file to check and processes it
var checkTheHtml = function( htmlfile, htmlurl, checksfile ) {
    if( !!htmlfile ) {
        // load synchroniously from local filesystem
        // console.log( fs.readFileSync( htmlfile ).toString() );
        var htmlText = fs.readFileSync( htmlfile ).toString();
        // console.log( 'HTML text:\n' + htmlText );
        checkHtmlFile( htmlText, checksfile );
    } else {
        // get asynchroniously
        // console.log( 'About to get: ' + htmlurl );
        restler.get( htmlurl )
        .on( 
            'success', 
            function( result ) { 
                // console.log( 'get: success' ); 
                var htmlText = result; 
                checkHtmlFile( htmlText, checksfile );
            }
        )
        .on( 
            'complete', 
            function( e ) { 
                // console.log( 'get: complete' ); 
            }
        );
    };
};

var checkHtmlFile = function( htmlText, checksfile ) {
    $ = cheerio.load( htmlText );
    var checks = loadChecks( checksfile ).sort();
    var out = {};
    for( var ii in checks ) {
        var present = $( checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    var outJson = JSON.stringify( out, null, 4 );
    console.log(outJson);
};

var clone = function(fn) {
    // workaround for commander.js issue http://stackoverflow.com/a/6772648
    return fn.bind({});
};

// START HERE *****************************************************************
if( require.main == module ) {
    // started on the command line
    startedOnCLI = true;
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone( assertFileExists ), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone( assertFileExists ))
        .option('-u, --url <html_file>', 'URL to index.html' )

    program.on( '--help', function(){
        console.log('');
        console.log('  --file and --url are mutually exclusive.');
        console.log('');
    });

    program.parse(process.argv);

    if( !program.file && !program.url ) {
        // must give file or URL
        console.log( 'Must specify one of file or URL. Exiting.' );
        process.exit(1);
    };
    if( !!program.file && !!program.url ) {
        // incompatible args
        console.log( 'File and url are mutually incompatible. Exiting.' );
        process.exit(1);
    };
     // console.log( 'HTML input file: ' + program.file );
     // console.log( 'HTML input URL: ' + program.url );
     // console.log( 'checks-to-perform file: ' + program.checks );

    var checkJson = checkTheHtml( program.file, program.url, program.checks );
} else {
    // called by another program as a function
    exports.checkHtmlFile = checkTheHtml;
};
