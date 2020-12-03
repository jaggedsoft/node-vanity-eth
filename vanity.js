// screen -S "vanity-eth" ~/4ever.sh nice -n 11 node ~/crypto/tools/ethereum/vanity
( async () => {
    const path = '~/crypto/tools/ethereum/';
    const createKeccakHash = require( 'keccak' );
    const secp256k1 = require( 'secp256k1' );
    const utils = require( 'web3-utils' );
    const crypto = require( 'crypto' );
    const chalk = require( 'chalk' );
    const fs = require( 'fs' );
    const util = require( 'util' );
    const Discord = require( 'discord.js' );
    
    // also alert to discord whenever you find a new key, otherwise remove
    const webhook = new Discord.WebhookClient( '<webhook id>', '<webhook password>' );
    
    const sleep = ms => new Promise( res => setTimeout( res, ms ) );
    const immediatePromise = util.promisify( setImmediate );
    ///////////////////////////////////////////////
    async function tick() {
        const prv = await randomKey();
        const pub = private2public( prv );
        last = pub;
        // TODO: first 8 all numbers 0x12345678
        // TODO: first 8 all letters 0xabcdefgh
        //console.info( `0x${ pub } ${ prv.toString( 'hex' ) }` ); process.exit();
        //const query = /^deaddead|^DEADdead|^deadDEAD|^DEADDEAD|^fadedface|^FADEDface|^fadedFACE|^badBADbad|^badbadbad|^BADbadBAD|^BADBADBAD|^badA55|^BADA55|^([a-fA-F0-9]{2})\1{3,}/g;
        // ^0FF1CE|^B00B135|^133742069|^13371337|^1337BEEF|^1337beef|^1337dead|^1337cafe|^1337babe|^0FF1CE420|^DEFACED|^BADBABE|^BEEFBABE|^DEADBABE|^B16B00B5|^deaddead|^deadd00d|^DEAD2BAD|^DEADBAAD|^DEADd00d|^fadedface|^faceb00c|^feedbeef|^feedbabe|^feedface|^beefcafe|^DEADBEAF
        //const query = /^420420420|^BAAAAAAD|^DEADdead|^deadDEAD|^DEADDEAD|^D15EA5E|^DEADC0DE|^deadbeef|^deadBEEF|^DEADbeef|^DEADBEEF|^FADEDface|^fadedFACE|^badBADbad|^badbadbad|^BADbadBAD|^BADBADBAD|^([a-fA-F0-9]{2})\1{3,}/g;
        const query = /^420420420|^DEADdead|^deadDEAD|^DEADDEAD|^DEADC0DE|^deadbeef|^deadBEEF|^DEADbeef|^DEADBEEF|^FADEDface|^fadedFACE|^badBADbad|^badbadbad|^BADbadBAD|^BADBADBAD|^A55B00B135|^([a-fA-F0-9]{2})\1{3,}/g;
        let m = query.exec( pub ), match = m != null;
        if ( match ) {
            let line = `${ chalk.cyan( '0x' + pub ) } ${ chalk.gray( prv.toString( 'hex' ) ) }`;
            matches = matches.slice( 0, 9 );
            matches.unshift( line );
            toast( line );
            LogAppend( `0x${ pub } ${ prv.toString( 'hex' ) }` );
            if ( webhook ) await webhook.send( `\`0x${ pub }\`` );
        } else {
            //console.info( chalk.gray( '0x' + pub ) );
        }
    }
    ///////////////////////////////////////////////
    let ops = 0, matches = [], last = '';
    setInterval( () => {
        displayOps( ops );
        ops = 0;
    }, 999 );
    ///////////////////////////////////////////////
    while ( true ) {
        await immediatePromise();
        if ( ++ops % 10000 == 0 ) await sleep( 1 );
        tick();
    }
    ///////////////////////////////////////////////
    function toast( text ) {
        process.stdout.write( "\033c" + `${ text }` );
    }
    function displayOps( y ) {
        //process.stdout.clearLine();
        //process.stdout.cursorTo( 0 );
        //process.stdout.write('\033c');
        //console.clear();
        //${ chalk.white( last.substr( 0, 10 ) ) }${ chalk.gray( last.substr( 11 ) ) }
        process.stdout.write( "\033c" + `${ chalk.magenta( y ) } ${ chalk.gray( last ) } ${ matches.join( " " ) }\n${ chalk.gray( ".".repeat( Math.round( y / 10 ) ) ) }` );
    }
    ///////////////////////////////////////////////
    function private2public( prvKey ) {
        const privateKey = Buffer.from( prvKey );
        const pubKey = Buffer.from( secp256k1.publicKeyCreate( privateKey, false ).slice( 1 ) );
        let hash = createKeccakHash( 'keccak256' ).update( pubKey ).digest().slice( -20 ).toString( 'hex' );
        return utils.toChecksumAddress( '0x' + hash ).slice( 2 );
    }
    async function randomKey( length = 32 ) {
        return new Promise( ( resolve, reject ) => {
            crypto.randomBytes( length, ( ex, buffer ) => {
                if ( ex ) reject();
                resolve( buffer );
            } );
        } );
    }
    ///////////////////////////////////////////////
    async function LogAppend( output ) {
        let date = new Date();
        let timestamp = pad( date.getHours() ) + ':' + pad( date.getMinutes() ) + ':' + pad( date.getSeconds() );//new Date().toLocaleString().replace(',','')
        fs.promises.appendFile( `${ path }ETH.txt`, `${ timestamp } ${ output }\n`, 'utf8' );
    }
    function pad( n, width = 2, z = '0' ) {
        n = n + '';
        return n.length >= width ? n : new Array( width - n.length + 1 ).join( z ) + n;
    }
} )();
