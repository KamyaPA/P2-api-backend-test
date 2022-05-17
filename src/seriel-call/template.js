// This file WILL NOT run it contains bits and pieces for creating a js server
// All this is so that the IDE likes the code

	// User set variables 
	let _0_, _1_, _2_, _3_, _4_, _5_, _6_, _7_, _8_, _9_;

	// Others
	let errorRemover;

//# Setup #
const H = "localhost";
const P = 3000; 
const S = "http://localhost:8080/graphql";
const {get} = require('http');
async function call(server, {domain, endpoint, argv, filter} ){
	let argvStr = argv.reduce((prev, cur) => prev += '"' + cur.key + '=' + cur.value + '",', "");
	return (await makeQueryCall(`${server}?query={call(api:"${domain}/${endpoint}",argv:[${argvStr}],filter:"${filter}")}`)).data.call;
}
async function callParalel(server, calls){
	let callStr = `${server}?query={`;
	await calls.forEach(({domain, endpoint, argv, filter}, index) => {
		let argvStr = argv.reduce((prev, cur) => prev += '"' + cur.key + '=' + cur.value + '",', "");
		callStr += `c${index}:call(api:"${domain}/${endpoint}",argv:[${argvStr}],filter:"${filter}") `
	});
	callStr += '}';
	return Object.values((await makeQueryCall(callStr)).data);
}
async function makeQueryCall(callStr){
	let data = "";
	return new Promise((resolve, reject) => {
		get(callStr, res => {
			res.on("data", chunk => {data += chunk});
			res.on("error", () => reject());
			res.on("end", () => {
				resolve(JSON.parse(data));
			});
		})
	});
}
//@

//# Setup HTTP #
const http = require('http');
const url = require('url');
const server = http.createServer(async (req, res)=>{
	let R = [];
	let u = url.parse(req.url);
	if(u.query){
		R.push(u.query.match(/[^&]+/g).reduce((p, c)=>{
			let v = c.split("=");
			p[v[0]] = v[1];
			return p;
		}, {}));
	}
	switch (u.pathname){_0_}
});
//@

//# Create Endpoint #
case _0_:
	_1_
	break;
//@

//# Default Endpoint #
default:
	_0_
	break;
//@

//# Create Response #
	res.setHeader("Content-Type", "application/json");
	res.statusCode = 200;
	res.write(_0_);
	res.send;
	res.end();
//@

//# Start Server #
	server.listen(P,H,()=>{
		console.log(`Server is running on ${H}:${P}`);
	});
//@

//# Single Call #
R.push(await call(S,_0_));
console.log(R);
//@

//# Multi Call #
console.log(R);
R.push(await callParalel(S,_0_));
//@
errorRemover = 
//# Call Object #
{domain:_0_,endpoint:_1_,argv:_2_,filter:_3_}
//@

//# Reduce  #
_0_.reduce((_1_, _2_) => (_4_), _3_)
//@

//# Concat #
_0_.concat(_1_)
//@

