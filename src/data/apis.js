let storedApisArray = [];

export default {
	getStoredApis : () => storedApisArray,

	// API - domain \\

	modifyApi : (domain) => {
		let api = storedApisArray.find(value => value.domain === domain);
		if (!api) {
			throw "Api does not exist";
		}
		return {targetApi : api};
	},

	createApi : (domain) =>  {
		if( storedApisArray.find(value => value.domain === domain)){
			throw "Api allready exists";
		}

		let newApi = {
			domain : domain,
			endpoints : []
		}
		storedApisArray.push(newApi);
		return newApi;
	},

	// ENDPOINTS \\

	createEndpoint : (api, path) => {
		if(api.endpoints.find(value => value.path === path)){
			throw "Endpoint allready exists";
		}
		let endpoint = {
			path : path,
			method : undefined,
			headers : [],
			responceHeaders : [],
			body : undefined,
			responceBody : undefined,
		}
		api.endpoints.push(endpoint);
		return endpoint;
	},

	modifyEndpoint : (api, path) => {
		let endpoint = api.endpoints.find(value => value.path === path);
		if(!endpoint){
			throw "Endpoint does not exist";
		}
		
		return endpoint;
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
		let header = headerList.find(value => value.key === key);
		if(header === undefined){
			throw "header does not exist";
		}
		else{
			delete header;
		}
	},
}

