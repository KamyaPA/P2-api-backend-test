export let storedApis = {};

export default {
	getStoredApis : () => Object.values(storedApis),

	// API - domain \\

	modifyApi : (name) => {
		let api = storedApis[name];
		if (!api) {
			throw "Api does not exist";
		}
		return api;
	},

	createApi : (name) =>  {
		if( storedApis[name] ){
			throw "Api allready exists";
		}

		let newApi = {
			name : name,
			domain : "",
			endpoints : {}
		}
		storedApis[name] = newApi;
		return newApi;
	},

	deleteApi : (name) => {
		delete storedApis[name];
		return `Deleted api ${name}`
	},

	// ENDPOINTS \\

	createEndpoint : (api, name) => {
		if(api.endpoints[name]){
			throw "Endpoint allready exists";
		}
		let endpoint = {
			name : name,
			path : "",
			method : undefined,
			description : "",
			headers : [],
			queryParams : [],
			responceHeaders : [],
			body : undefined,
			responceBody : undefined,
		}
		api.endpoints[name] = endpoint;
		return endpoint;
	},

	modifyEndpoint : (api, name) => {
		let endpoint = api.endpoints[name];
		if(!endpoint){
			throw "Endpoint does not exist";
		}
		
		return endpoint;
	},

	deleteEndpoint : (api, name) => {
		delete api.enpoints[name]
		return `Deleted Enpoint "${api.name}/${name}"`
	},

	// HEADERS \\

	setHeader : (headerList, key, value) => {
		let header = headerList.find(value => value.key === key);
		if(header){
			 header.value = value;
			return `Header value of key: ${key} has been replaced by a new value: ${value}.`
		}
		else{
			header = headerList.push({key : key, value : value});
			return `Header has been created with key: ${key} and value : ${value}`;
		}
	},

	deleteHeader : (headerList, key) => {
		let oldLength = headerList.length;
		headerList = headerList.filter(value => value.key === key)
		let newLength = headerList.length;
		if(newLength === oldLength){
			throw "header does not exist";
		}
		return `Header whith key: ${key}  deleted`
	},
}

