const _fs = require('fs');
const _path = require( 'path' );
console._info = console.info;
console._log = console.log;
console.log = ( color, msg ) => {
    if ( !msg ) return console._log( color );
    console._log( color, `-- ${msg}`)
}
console.success = ( msg ) => {
    console.log( '\x1b[32m', msg );
}
console.info = ( msg ) => {
    console.log( '\x1b[33m%s\x1b[0m', msg );
}
console.error = ( msg ) => {
    console.log( '\x1b[31m', msg );
}
console.reset = ( ) => {
    console.log( '\x1b[0m' );
}
const deleteFolderRecursive = function ( path, count ) {
    if ( !count ) count = 0;
    if ( _fs.existsSync( path ) ) {
        _fs.readdirSync( path ).forEach( ( file, index ) => {
            const curPath = _path.join( path, file );
            if ( _fs.lstatSync( curPath ).isDirectory() ) {
                deleteFolderRecursive( curPath, count + 1 );
            } else {
                console.error( `Deleting:\r\n${curPath}` );
                _fs.unlinkSync( curPath );
            }
        } );
        _fs.rmdirSync( path, { recursive: true } );
    } else {
        if ( count > 0 ) return;
        return console.info( `Doesn't exist: ${path}` );
    }
};
const getRootFiles = ( rootPath, filter ) => {
    const files = _fs.readdirSync( rootPath );
    const matchFiles = [];
    for ( const path of files ) {
        const absPath = _path.join( rootPath, path );
        const stat = _fs.lstatSync( absPath );
        if ( stat.isDirectory() ) continue;
        const p = _path.parse( path );
        if ( p.ext.indexOf( filter ) >= 0 ) {
            console.info( `found:\r\n${absPath}` );
            matchFiles.push( {
                absPath, parsedPath: p
            } );
        }
    }
    return matchFiles;
}
const deleteRootFiles = ( rootPath, filter ) => {
    const matchFiles = getRootFiles( rootPath, filter );
    if ( matchFiles.length === 0 ) {
        return console.info( `No ${filter} file found in ${rootPath}` );
    }
    matchFiles.forEach( a => {
        console.info( `Working file:\r\n${a.absPath}` );
        const index = a.parsedPath.name.lastIndexOf( "." );
        if ( index > 0 ) {
            const jsfileName = `${a.parsedPath.name.substring( 0, index )}.js`;
            //.js.map
            const jsFile = _path.resolve( `${rootPath}/${jsfileName}` );
            if ( _fs.existsSync( jsFile ) ) {
                console.error( `Deleting file:\r\n${jsFile}` );
                _fs.unlinkSync( jsFile);
            }
            const jsMapFile = _path.resolve( `${rootPath}/${jsfileName}.map` );
            if ( _fs.existsSync( jsMapFile ) ) {
                console.error( `Deleting file:\r\n${jsMapFile}` );
                _fs.unlinkSync( jsMapFile );
            }
        }
        console.error( `Deleting file:\r\n${a.absPath}` );
        _fs.unlinkSync( a.absPath );
    } );
    
}
deleteFolderRecursive( _path.resolve( 'dist/lib' ) );
deleteRootFiles( _path.resolve( 'dist' ), "ts" );
console.reset();