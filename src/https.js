
// Configuration
const HOSTNAME = "stud-a224bf22.srv.aau.dk";
const PORT = 443;

// Tells the HTTP server not to start
global.https = true;
global.serverAddress = "https://" + HOSTNAME + ":" + PORT.toString(); 

// Code
import fs from 'fs';
import https from 'https';
import {app} from './server.js';

const server = https.createServer({
	key : fs.readFileSync('/etc/cert/key.pem'),
	cert : fs.readFileSync('/etc/cert/cert.pem'),
}, app);

server.listen(PORT, () => console.log('Server is running on ' + PORT.toString()));

