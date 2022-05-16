import {call, callParalel} from './call.js';
import {createServer} from './loadTemplate.js';
import express from 'express';
import fs from 'fs';


const PORT = 3500;
const HOSTNAME = "localhost";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
	const file = await fs.promises.readFile("./pub/Index.html");
	res.setHeader("content-type", "text/html")
	res.send(file);
	res.end();
})

app.get("/apiCreator.js", async (req, res) => {
	const file = await fs.promises.readFile("./pub/apiCreator.js");
	res.setHeader("content-type", "text/javascript")
	res.send(file);
	res.end();
})

app.post("/", (req, res) => {
	let rtnServer = createServer(req.body);
	res.send(rtnServer);
	res.end();
})

app.listen(PORT, HOSTNAME, () => {
	console.log(`Server is running on ${HOSTNAME}:${PORT}`);
})

/*
console.log(await createServer([
	{
		backend : {
			endpoint : "/pokemon",
			headers : [
				{
					key : "pokemon",
					valueType : "string"
				}
			],
			api : [
				{
					domain : "PokeAPI",
					endpoint : "Pokemon",
					method : "Get",
					input : {
						headers : [],
						query : [
							{
								key : "pokemon",
								id : "0 pokemon"
							}
						]
					},
					output : {
						body : {
							name : "name",
							moves : [
								"all",
								{
									move:{
										name : "[moves]"
									}
								}
							],
							types : [
								"all",
								{
									type : {
										name : "[types]"
									}
								}
							]
						}
					}
				},
				{
					domain : "PokeAPI",
					endpoint : "Move",
					method : "Get",
					input : {
						headers : [],
						query : [
							{
								key : "move",
								id : "1 [moves]"
							},
						]
					},
					output : {
						body : {
							name : "name",
							power : "power"
						}
					}
				}
			]
		}
	}
]));
*/
