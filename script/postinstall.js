// ceci deviendra un module plus tard pour le moment on laisse comme ça

var fs = require('fs');
var meta = JSON.parse(fs.readFileSync('./package.json'));

if( fs.existsSync('./.gitignore') ){
	var ignored = String(fs.readFileSync('./.gitignore')).split('\n');
	var ignore = function(entry){
		if( ignored.indexOf(entry) === -1 ){
			fs.appendFileSync('./.gitignore', '\n' + entry);
			ignored.push(entry);
		}	
	};
}
else{
	var ignore = function(){};
}

// faudrais plutot test si c'est un symlink
if( false === fs.existsSync('lib/modules') ){
	if( meta.dependencies ){
		ignore('node_modules/');
		ignore('lib/modules');

		fs.symlinkSync('node_modules', 'lib/modules', 'junction');
	}
}