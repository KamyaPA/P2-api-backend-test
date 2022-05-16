import fetch from 'node-fetch';

const i = 2
// calls the api server with a specific domain, filter and argumets 
export async function call(server, {domain, endpoint, argv, filter} ){
	let argvStr = argv.reduce((prev, cur) => prev += '"' + cur.key + '=' + cur.value + '",', "");
	return (await makeQueryCall(`${server}?query={call(api:"${domain}/${endpoint}",argv:[${argvStr}],filter:"${filter}")}`)).data.call;
}

export async function callParalel(server, calls){
	let callStr = `${server}?query={`;
	await calls.forEach(({domain, endpoint, argv, filter}, index) => {
		let argvStr = argv.reduce((prev, cur) => prev += '"' + cur.key + '=' + cur.value + '",', "");
		callStr += `c${index}:call(api:"${domain}/${endpoint}",argv:[${argvStr}],filter:"${filter}") `
	})
	callStr += '}';
	return Object.values((await makeQueryCall(callStr)).data);
}

async function makeQueryCall(callStr){
	return await fetch(callStr, {
		method : "GET"
	}).then(res => res.json());
}

