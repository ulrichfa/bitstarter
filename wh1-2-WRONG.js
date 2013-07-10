(function() {
    // build an array with numbers 1 ... 100
    var p = new Array(101);
    var i;
    for( i = 0; i <= 100; i++ ) {
      p[i] = i; 
    };
    // replace non-primes with zeros
    p[1] = 0;
    var d;                                  // divisor
    for( d = 2; d < 11; d++ ) {             // the divisor range
        if( p[d] !== 0 ) {                  // skip non-prime divisors
            for( i = d; i < 101; i+=d ) {   // check all d's multiples
                if(( i % d ) === 0 ) {      // if divisible
                    if( i !== d ) {         // and not the divisor itself
                        p[i] = 0;           // it is not a prime
                    };
                };
            };
        };
    };
    // print the list
    var theList = '';
    for( i = 0; i <= 100; i++ ) {
        if( p[i] !== 0 ) {
            theList += ( ',' + p[i] );
        };
    };
    console.log( theList.substring(1) );
})();
