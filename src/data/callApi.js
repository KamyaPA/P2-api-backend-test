//import { header } from 'express/lib/request';
import fetch from 'node-fetch';
import { storedApis } from './apis.js';
import { filterResponse }  from './filter.js'
//import { bodyStatus } from './Bodystatus.js';

export async function callApi(apiString, argv, filterStr){
	// Get API and endpoint 
	apiString = apiString.split("/");
	let api = storedApis[apiString[0]];
	let endpoint = api.endpoints[apiString[1]];
	let headers =  endpoint.headers.reduce((prev, cur) => {
		prev[cur.key] = cur.value;
		return prev;
	}, {})
	var payload;
	// Set Parameters
	let path = api.domain + endpoint.path;
	let nQueryParams = 0;
	let headerIndex = 0;
	if(argv){
		argv.forEach((argument) => {
			argument = argument.split("=").map(value => value.trim());
			if(endpoint.queryParams.find(parameter => parameter === argument[0])){
				if(nQueryParams > 0){
					path += '&';
				} 
				else{
					path += '?';
				}
				path += argument[0] + "=" + argument[1];
				nQueryParams += 1;
			} else if((headerIndex = Object.values(headers).findIndex(v => v === "{" + argument[0] + "}"))!= -1){
				headers[Object.keys(headers)[headerIndex]] = argument[1];
			} else {
				path = path.replace(`{${argument[0]}}`, argument[1]);
			}
		})
	}
	// Call API
	const bodyParam = {
		body : endpoint.body
	}
	let obj = {
		headers : headers,
		method : endpoint.method,
	}
	if(typeof endpoint.body === 'string' && endpoint.body.length > 0){
		payload = Object.assign(obj, bodyParam);
		console.log(payload);
	}else{
		payload = obj;
	}

	let data = await fetch(path, payload)
	.then(async (res) => ({body: await res.json(), headers:res.headers}));
	console.log(data);
	if(filterStr){
		data = filterResponse(data.body, data.headers, filterStr);
	}

	return data;
}

