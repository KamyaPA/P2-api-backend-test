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
	var payload;

	// Set Parameters
	let path = api.domain + endpoint.path;
	let nQueryParams = 0;
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
			}
			else{
				path = path.replace(`{${argument[0]}}`, argument[1]);
			}
		})
	}
	// Call API
	

	const bodyParam = {
		body : endpoint.body
	}
	let obj = {
		headers : endpoint.headers.reduce((prev, cur) => {prev[cur.key] = cur.value}, {}),
		method : endpoint.method,
	}
	if(typeof endpoint.body === 'string' && endpoint.body.length > 0){
		payload = Object.assign(obj, bodyParam);
		console.log(payload);
	}else{
		payload = obj;
	}

		let data = await fetch(path, payload)
		.then(res => {
			let data;
			data = res.json();
			return data;
		})
		.then(body => body);

		if(filterStr){
			data = filterResponse(data, filterStr);
		}

		return data;
}

