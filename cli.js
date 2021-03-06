#!/usr/bin/env node
'use strict';


const program = require('commander');
const fs = require('fs');
const nconf = require('nconf');
const fileview = require('./index');
const pkg = require('./package.json');

program
	.version(pkg.version)
	.description('Download, upload or view files in your dropbox account')
	.option('-t, --token <value>', 'Enter your dropbox authentication token')
	.option('-d, --download <value>', 'Enter the full dropbox path of the file to be downloaded (Downloads to working directory')
	.option('-u, --upload <value>', 'Enter the full relative path of the file to be uploaded (Uploads to the dropbox root')
	.option('-v, --view [value]', 'Enter the path of the dropbox folder to view or enter "#root" to view the root folder')
	.option('-r, --revoke-token', 'Use this flag to revoke the access token')
	.parse(process.argv);

	
program.on('--help', ()=>{
	console.log('  Fileview fetches authentication token from either of 2 means:');
	console.log('    **Config file at /config.json [RECOMMENDED]');
	console.log('    **Commandline option; "-t" or "--token" flag [OVERRIDES THE CONFIG');
	console.log(__dirname);
	
});

//Run help if no argument is supplied
if(!process.argv.slice(2).length) {
	program.help();
}

nconf.argv().file({file: __dirname + '/config.json'});

if(!program.token && !nconf.get('DROPBOX_TOKEN')) {
	throw new Error('No specified dropbox Token. Use the "-t || --token" flag or the config file');
}
else if(!program.token) {
	program.token = nconf.get('DROPBOX_TOKEN');
}

fileview(program);