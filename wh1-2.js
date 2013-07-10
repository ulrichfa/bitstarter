  // find the first 100 prime numbers
  var p = new Array(1);                         // will hold the first 100 primes
  p[0] = 2;                                     // seed with the first prime
  var nextNumber = 3;                           // next prime candidate
  while( p.length < 100 ) {
    for( var i = 1; i <= p.length; i++ ) {      // for all found primes but 2
      if(( nextNumber % p[i] ) === 0 ) {        // is divisible?
        break;                                  // if so then stop looping
      };
    };
    if( !( i < p.length )) {                    // finished looping over all primes
      p.push( nextNumber );                     // so it's a prime, add to list
    };
    nextNumber += 2;                            // skipping evens
  };

  // build and print the list
  var theList = '';
  for( var k = 0; k < p.length; k++ ) {
    theList += ( ',' + p[k] );
  };
  console.log( theList.substring(1) );

