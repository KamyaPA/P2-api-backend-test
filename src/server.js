import fs from 'fs';

import {createServer} from './seriel-call/loadTemplate.js'

import express from 'express';
import { setupGraphQL } from './graphql/graphql.js';

export const app = express();
const PORT = 8080;
const HOSTNAME = 'localhost';

app.use(express.json());

// Endpoint
app.get('/', async (req, res) => {
	const  file = await fs.promises.readFile('./src/pub/Index.html');
	res.setHeader("content-type", "text/html");
	res.send(file);
	res.end();
})

app.get('/apiCreator.js', async (req, res) => {
	const  file = await fs.promises.readFile('./src/pub/apiCreator.js');
	res.setHeader("content-type", "text/javascript");
	res.send(file);
	res.end();
})

app.post('/submit', async (req, res) => {
	const rtnServer = await createServer(req.body);
	res.setHeader("content-disposition", "attachment;filename=\"server.js\"");
	res.setHeader("content-type", "text/javascript");
	res.send(rtnServer);
	res.end();
})

app.use('/graphql', setupGraphQL());

// Start server if the HTTPs server should not start
if(global.https === undefined){
	global.serverAddress = `http://${HOSTNAME}:${PORT}`
	app.listen(PORT, HOSTNAME, () => {
		console.log(`Server is on at ${HOSTNAME}:${PORT}`);
	})
}

